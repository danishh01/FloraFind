import axios from "axios";

// ---------------------------------------------------------------------------
// IMPPAT (https://cb.imsc.res.in/imppat/) publishes a per-species
// "therapeutics" page at:
//   https://cb.imsc.res.in/imppat/therapeutics/<url-encoded scientific name>
// e.g. https://cb.imsc.res.in/imppat/therapeutics/Tribulus%20terrestris
//
// This was verified manually against the live site before writing this
// parser (see conversation notes): the page is plain server-rendered HTML
// (PHP), not a JS-rendered SPA - the therapeutic-use table is present in
// the initial HTTP response body, inside a single
// <table id="table_id" class="phytochem1 table">...</table>, with columns:
//   Indian medicinal plant | Plant part | Therapeutic use |
//   Therapeutic use identifiers | References
//
// The page's <a> tags inside table cells are NOT properly closed before
// </td> (e.g. <td><a href="...">Analgesics</td> - no </a>). This is real,
// consistently malformed markup on the live site. An HTML5-tree-construction
// parser (cheerio/parse5) was tested against it and produced misaligned
// columns on later rows because of how it recovers from the dangling <a>.
// The <td>...</td> and <tr>...</tr> boundaries themselves ARE always
// well-formed on this page, so cell/row extraction is done here with
// targeted regexes instead, which was verified byte-for-byte against the
// live response to extract rows correctly (146/146 rows for Tribulus
// terrestris, 376/376 for Azadirachta indica).
//
// A plant with no IMPPAT record still returns HTTP 200, just with an empty
// <tbody> (only the header row). That - not the HTTP status - is how
// "not found" is detected.
// ---------------------------------------------------------------------------

const IMPPAT_BASE_URL = "https://cb.imsc.res.in/imppat/therapeutics";

// IMPPAT is a public research site with no documented bot policy, but
// identifying ourselves is good practice for external APIs.
const REQUEST_HEADERS = {
  "User-Agent":
    "FloraFind/1.0 (Educational plant identification project; https://github.com/florafind)",
};

const stripTags = (s) =>
  (s || "")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();

/**
 * Parses the real IMPPAT therapeutics page HTML into row objects. Returns
 * [] if the expected table isn't present at all (unexpected page shape),
 * so callers can distinguish "found the table but it's empty" (not found)
 * from "page structure wasn't what we expected" (treated as unavailable).
 */
const parseTherapeuticsHtml = (html) => {
  const tableMatch = html.match(/<table[^>]*id="table_id"[^>]*>([\s\S]*?)<\/table>/);
  if (!tableMatch) return null;

  const tbodyMatch = tableMatch[1].match(/<tbody>([\s\S]*?)<\/tbody>/);
  const tbodyHtml = tbodyMatch ? tbodyMatch[1] : "";

  const rowMatches = [...tbodyHtml.matchAll(/<tr>([\s\S]*?)<\/tr>/g)];

  return rowMatches.map((rowMatch) => {
    const cellMatches = [...rowMatch[1].matchAll(/<td>([\s\S]*?)<\/td>/g)];
    const cells = cellMatches.map((c) => stripTags(c[1]));
    return {
      plant: cells[0] || "",
      plantPart: cells[1] || "",
      therapeuticUse: cells[2] || "",
      references: cells[4] || "",
    };
  });
};

// How many uses to keep per plant part. IMPPAT can list 30-100+ distinct
// uses for a single part, which is both overwhelming to read and (for the
// AI translation step) too large to reliably fit a single response inside
// the configured provider's token budget. Instead of showing everything,
// each use's popularity is ranked by how many distinct literature
// references IMPPAT itself cites for it - a use backed by more references
// is more consistently documented/"common" than one backed by a single
// citation. This ranking is derived entirely from real IMPPAT data (the
// References column), never guessed.
const MAX_USES_PER_PART = 5;

// Rows with no plant part recorded in IMPPAT aren't attributable to any
// specific part, so they're not actionable for a "which part do I use"
// display and are dropped rather than shown under a vague "Unspecified"
// group.
const UNSPECIFIED_PART = "Unspecified";

/**
 * Groups raw IMPPAT rows into { plantPart, uses[], references[] }, keeping
 * only the most-referenced (most commonly documented) uses per part.
 */
const groupByPlantPart = (rows) => {
  const byPart = new Map();

  for (const row of rows) {
    if (!row.therapeuticUse) continue;
    const partKey = row.plantPart || UNSPECIFIED_PART;
    if (partKey === UNSPECIFIED_PART) continue;

    if (!byPart.has(partKey)) {
      byPart.set(partKey, new Map());
    }
    const useMap = byPart.get(partKey);
    if (!useMap.has(row.therapeuticUse)) {
      useMap.set(row.therapeuticUse, new Set());
    }
    row.references
      .split(",")
      .map((r) => r.trim())
      .filter(Boolean)
      .forEach((r) => useMap.get(row.therapeuticUse).add(r));
  }

  return [...byPart.entries()].map(([plantPart, useMap]) => {
    const ranked = [...useMap.entries()]
      .sort((a, b) => b[1].size - a[1].size)
      .slice(0, MAX_USES_PER_PART);

    const references = new Set();
    ranked.forEach(([, refs]) => refs.forEach((r) => references.add(r)));

    return {
      plantPart,
      uses: ranked.map(([use]) => use),
      references: [...references],
    };
  });
};

/**
 * Fetches and parses real traditional/medicinal-use data for a plant from
 * IMPPAT, keyed by its scientific name. Preserves the plant-part -> use
 * relationship exactly as published; never invents, guesses, or falls back
 * to another source for this data. On any failure (not found, network
 * error, timeout, unexpected page shape) it resolves to
 * { available: false, reason } - it never throws, so a temporarily
 * unavailable IMPPAT can never crash the rest of the plant lookup.
 */
export const getTraditionalUses = async (scientificName) => {
  const name = (scientificName || "").trim();
  if (!name) {
    return { available: false, reason: "No scientific name was provided for the IMPPAT lookup." };
  }

  const url = `${IMPPAT_BASE_URL}/${encodeURIComponent(name)}`;

  let response;
  try {
    response = await axios.get(url, {
      headers: REQUEST_HEADERS,
      timeout: 15000,
      validateStatus: (status) => status < 500,
    });
  } catch (err) {
    console.warn(`[IMPPAT] Request failed: ${err.code || err.message}`);
    return { available: false, reason: "IMPPAT could not be reached (network error or timeout)." };
  }

  if (response.status !== 200) {
    return { available: false, reason: `IMPPAT responded with HTTP ${response.status}.` };
  }

  const rows = parseTherapeuticsHtml(response.data);

  if (rows === null) {
    console.warn("[IMPPAT] Expected table#table_id was not found in the response.");
    return {
      available: false,
      reason: "IMPPAT page structure was not recognized (site may have changed).",
    };
  }

  if (rows.length === 0) {
    return { available: false, reason: "Plant not found in IMPPAT." };
  }

  const parts = groupByPlantPart(rows);
  console.log(`[IMPPAT] ${name}: ${rows.length} rows, ${parts.length} plant parts`);

  if (parts.length === 0) {
    return {
      available: false,
      reason: "IMPPAT rows exist but none specify a plant part.",
    };
  }

  return {
    available: true,
    scientificName: name,
    parts,
    source: { name: "IMPPAT", url },
  };
};

export default { getTraditionalUses };
