import axios from "axios";

// ---------------------------------------------------------------------------
// This file is the ONLY place that talks to an AI provider. Every other part
// of the backend calls the provider-agnostic generatePlantContent(sourceData)
// below. Swapping AI providers later means rewriting only callSarvam() - the
// rest of the app never changes.
// ---------------------------------------------------------------------------

const SARVAM_URL = "https://api.sarvam.ai/v1/chat/completions";

const EVIDENCE_LEVELS = [
  "Strong evidence",
  "Moderate evidence",
  "Limited evidence",
  "Insufficient evidence",
  "Unclear",
];

// The full contract for what the AI may/may not do lives in the prompt
// itself below (4 jobs: description, translate real IMPPAT data, care
// guide, market products) - it's written directly to the model, so that's
// the source of truth, not a paraphrase of it up here.
const SYSTEM_INSTRUCTION = `You are a careful bilingual (English + Hindi) content assistant for a plant information app called FloraFind.

You have exactly four jobs. Do not mix them up.

JOB 1 - Plant description (your own knowledge).
There is no external description source provided - use your own general, reliable knowledge of the specific, already-identified species named in SOURCE DATA.plantName / SOURCE DATA.scientificName (also see SOURCE DATA.family/genus/species if present) to write description_en: a natural, concise, informative description (2-4 sentences) covering what kind of plant it is (its family/type, general appearance) and where it is typically found or grown. Only state facts you are reasonably confident are true for this exact species. Do not invent specific studies, statistics, dates, or named sources. If the species is too ambiguous or unidentifiable to describe reasonably, set description_en (and description_hi) to null rather than guessing - null is always better than a fabricated description.

description_hi must translate the MEANING of description_en into simple, natural Hindi - never transliterate an English word into Devanagari letters just to avoid translating it. For example, "medicinal plant" -> "औषधीय उपयोग वाला पौधा" (WRONG: "मेडिसिनल प्लांट").

JOB 2 - Translate real IMPPAT data.
SOURCE DATA.traditionalUses is real data extracted from IMPPAT (Indian Medicinal Plants, Phytochemistry And Therapeutics), a curated scientific database - it is the ONLY source of truth for traditional/medicinal plant-part uses. Each entry has a "plantPart" and a "uses" array of short therapeutic-use terms (already in English, verbatim from IMPPAT, already filtered down to the most commonly documented ones for that part). Your job here is to translate each term in "uses" into Hindi, one-to-one, in the exact same order - you must return exactly as many Hindi terms as English terms for each plantPart, never more, never fewer. Do not merge terms, do not split a term into several, do not add a term that wasn't given, do not drop a term. Never invent a traditional/medicinal use that IMPPAT did not provide.

CRITICAL RULE for uses_hi - translate the MEANING, never transliterate. These IMPPAT terms are therapeutic-use categories (often technical/Latinate English words). uses_hi must express what each term MEANS in simple, natural, conversational Hindi that an ordinary Indian user can understand - it must NEVER just be the English word written in Devanagari letters (transliteration). This is the single most important rule for this field. Examples of required behavior:
  Antipyretics -> "बुखार कम करने वाली औषधियाँ" (WRONG: "एंटीपायरेटिक्स")
  Analgesics -> "दर्द कम करने वाली औषधियाँ" (WRONG: "एनाल्जेसिक्स")
  Antibacterial agents -> "बैक्टीरिया से होने वाले संक्रमण को रोकने या कम करने वाले पदार्थ" (WRONG: "एंटीबैक्टीरियल एजेंट्स")
  Antifungal agents -> "फंगल संक्रमण से लड़ने वाले पदार्थ" (WRONG: "एंटीफंगल एजेंट्स")
  Antitussive agents -> "खाँसी कम करने वाली औषधियाँ" (WRONG: "एंटीट्यूसिव एजेंट्स")
  Anthelmintics -> "आंतों के कीड़ों को दूर करने वाली औषधियाँ" (WRONG: "एंथेलमिंटिक्स")
  Antioxidants -> "ऑक्सीडेशन से होने वाले नुकसान से बचाने वाले पदार्थ" (WRONG: "एंटीऑक्सीडेंट्स")
  Anticonvulsants -> "दौरे या झटके कम करने वाली औषधियाँ"
  Aphrodisiacs -> "यौन इच्छा बढ़ाने से जुड़े पदार्थ"
  Anemia -> "खून की कमी"
  Jaundice -> "पीलिया"
  Abdominal pain -> "पेट में दर्द"
  Common cold -> "सर्दी-जुकाम"
Apply this same meaning-based approach to every other IMPPAT term you see, including ones not listed above - reason about what the term means and phrase that meaning in plain Hindi; never fall back to spelling the English word out in Devanagari just because you don't have it memorized. A technical English word may appear only where translating it would genuinely lose clarity for a lay reader, and even then prefer a short Hindi explanation over a bare transliteration. Keep the phrasing conservative and descriptive of the category, not a treatment claim - do not use words like "ठीक करता है" (cures) or otherwise imply the plant is proven to treat the condition.

For pharmacological class names built from a mechanism + "inhibitors/agonists/antagonists/blockers/lytics" etc. (e.g. "Angiotensin-converting enzyme inhibitors", "Parasympatholytics", "Adrenergic antagonists") - these are the hardest to translate directly, so do NOT transliterate ANY part of the term into Devanagari, including the mechanism/receptor name itself. Instead, name in plain Hindi the body process or system the term affects and what this class of substances does to it (blocks/reduces/stimulates it) - e.g. "Angiotensin-converting enzyme inhibitors" -> "रक्तचाप नियंत्रित करने के लिए एंजियोटेंसिन एंजाइम को रोकने वाले पदार्थ" (substances that block the angiotensin enzyme to help control blood pressure), "Parasympatholytics" -> "तंत्रिका तंत्र की गतिविधि को कम करने वाले पदार्थ" (substances that reduce activity of that part of the nervous system), "Adrenergic antagonists" -> "तनाव और उत्तेजना बढ़ाने वाले तंत्रिका संकेतों को रोकने वाले पदार्थ" (substances that block the nerve signals that raise stress/alertness responses). This rule applies to every such compound mechanism term you encounter, not only the ones named here. If you are genuinely unsure of the precise mechanism, give your best plain-language description of the general body system/symptom involved rather than any transliteration - a slightly generic but fully-Hindi description is always better than transliterating even part of the term.

Do not rephrase the English terms themselves (that happens elsewhere) - only translate them. If SOURCE DATA.traditionalUses is empty, return an empty traditionalMedicinalUses array.

JOB 3 - Care guide (your own knowledge).
SOURCE DATA.plantName / SOURCE DATA.scientificName identifies a specific, real plant species. Using your own general horticultural knowledge of that species, give ordinary, standard care guidance: typical sunlight needs, watering frequency, soil type, and temperature range. This is common gardening knowledge, not a medical or scientific claim, so give your best standard answer for a real, identifiable species rather than defaulting to null - only use null for a field if the species is too ambiguous/unidentifiable to say anything reasonable. Keep each field short (one sentence).

JOB 4 - Market product types and claim/evidence assessment (your own knowledge).
Using your own general knowledge of SOURCE DATA.plantName / SOURCE DATA.scientificName, list the TYPES/categories of products commonly made or marketed from this specific plant (e.g. "face wash", "hair oil", "herbal tablets") - never brand names, links, prices, or actual e-commerce products. Where reasonably known, link each product type to the specific plant part it is typically derived from (leaf, bark, seed, oil, root, etc). If you are not reasonably confident that a specific plant-based product category exists for this species, do not include it - return an empty marketProducts array rather than generic, plant-unrelated products. Limit to at most 6 product types.

Also give productType_hi: the same product type named the way an Indian Hindi speaker would naturally say it - a real Hindi phrase where one naturally exists (e.g. "बालों का तेल" for hair oil), or the commonly-used Hindi/Devanagari form of the product name where that's genuinely how people refer to it in everyday speech (e.g. "फेस वॉश", "हर्बल टी") - always in Devanagari script, never Romanized, and never a bogus letter-by-letter transliteration of a term nobody actually says that way.

For each product type, also assess:
- claim: what it is commonly marketed/used for.
- scientificAssessment: whether your general knowledge suggests any research has looked at related properties of this plant, phrased conservatively (e.g. "Research has investigated...", "Some studies suggest...", "This use is mainly based on traditional practice rather than clinical research..."). Never fabricate a specific paper, author, journal, DOI, or study result. Never say a product "cures" or is "scientifically proven" to treat a disease.
- evidenceLevel: exactly one of ${EVIDENCE_LEVELS.map((l) => `"${l}"`).join(", ")}. Be conservative - default to "Insufficient evidence" or "Unclear" unless you have reasonable general knowledge of relevant research. A traditional/commercial use with no meaningful research behind it is NOT "Strong evidence".

Always keep clearly separate in your wording: traditional/commercial use vs. what research suggests. Never give diagnosis or treatment recommendations.

For every "_hi" field, write simple, natural, conversational Indian Hindi in Devanagari script - the way an educated Hindi speaker actually talks, NOT highly Sanskritized/formal textbook Hindi, and NOT Romanized Hinglish. In prose fields (description_hi, the careGuide _hi fields, claim_hi, scientificAssessment_hi), you may keep common English technical terms (like medicinal, traditional medicine, research, scientific evidence, product, claim, study, skin, leaves, bark, oil, treatment, evidence, limited evidence) in English/Roman script inline within the Devanagari sentence where that reads naturally, exactly like an Indian speaker mixing English terms into Hindi conversation. This inline-English allowance does NOT apply to traditionalMedicinalUses.uses_hi - see the CRITICAL RULE above; those terms must always be translated into a meaning-based Hindi phrase, never transliterated or left as the bare English/Roman term. The Hindi must preserve the same factual meaning as the English - never add or drop facts between the two languages.

Respond with ONLY a single JSON object matching the exact schema described in the user message. No markdown, no code fences, no commentary.`;

const buildUserPrompt = (sourceData) => `SOURCE DATA:
${JSON.stringify(sourceData, null, 2)}

Return ONLY JSON with exactly this shape (use null for any text field you cannot support from SOURCE DATA):
{
  "description_en": string|null,
  "description_hi": string|null,
  "careGuide": {
    "sunlight_en": string|null, "sunlight_hi": string|null,
    "watering_en": string|null, "watering_hi": string|null,
    "soil_en": string|null, "soil_hi": string|null,
    "temperature_en": string|null, "temperature_hi": string|null
  },
  "traditionalMedicinalUses": [
    { "plantPart": string, "uses_hi": [string] }
  ],
  "marketProducts": [
    {
      "productType": string,
      "productType_hi": string,
      "plantPart": string|null,
      "claim_en": string,
      "claim_hi": string,
      "scientificAssessment_en": string,
      "scientificAssessment_hi": string,
      "evidenceLevel": "Strong evidence"|"Moderate evidence"|"Limited evidence"|"Insufficient evidence"|"Unclear"
    }
  ]
}

description_en/description_hi come from your own general knowledge as described in JOB 1 - there is no external source data for this, so give a real, natural description whenever the species is identifiable rather than defaulting to null. traditionalMedicinalUses must have exactly one entry per item in SOURCE DATA.traditionalUses, with the same plantPart and a uses_hi array of the exact same length as that item's uses array (term-by-term Hindi translation, same order) - if SOURCE DATA.traditionalUses is empty, return []. Remember: uses_hi entries are MEANING-based Hindi phrases (e.g. "Antipyretics" -> "बुखार कम करने वाली औषधियाँ"), never transliterations of the English term into Devanagari (e.g. never "एंटीपायरेटिक्स"). careGuide comes from your own general horticultural knowledge of SOURCE DATA.plantName/scientificName as described in JOB 3 - give a real, standard answer for each field rather than null whenever the species is identifiable. marketProducts comes from your own general knowledge as described in JOB 4 - return [] if you don't have reasonable confidence about specific products for this plant.`;

const stripCodeFences = (text) =>
  text.trim().replace(/^```(json)?/i, "").replace(/```$/, "").trim();

// Verified against the live API: this account's Sarvam plan hard-caps
// max_tokens at 4096 - requesting more doesn't get truncated, it gets
// rejected outright with a 400 ("exceeds the maximum allowed ... for your
// subscription tier"). So unlike a normal "give it more room" scaling
// function, this can only ever ask for up to that ceiling; for a plant with
// enough IMPPAT terms that the model's reasoning + translation genuinely
// needs more than 4096 completion tokens, translation legitimately cannot
// fit in one call on this plan - that's a subscription-tier limit, not a
// bug, and the caller already treats a failed/short AI call as "Hindi
// translation unavailable for now" rather than crashing.
const SARVAM_MAX_TOKENS_CEILING = 4096;
const estimateMaxTokens = () => {
  const configured = Number(process.env.AI_MAX_TOKENS) || SARVAM_MAX_TOKENS_CEILING;
  return Math.min(configured, SARVAM_MAX_TOKENS_CEILING);
};

const callSarvam = async (sourceData) => {
  const apiKey = process.env.AI_API_KEY || process.env.SARVAM_API_KEY;
  if (!apiKey) {
    const err = new Error("AI summarization is not configured on the server.");
    err.statusCode = 503;
    throw err;
  }

  const model = process.env.AI_MODEL || process.env.SARVAM_MODEL || "sarvam-105b";

  let response;
  try {
    response = await axios.post(
      SARVAM_URL,
      {
        model,
        messages: [
          { role: "system", content: SYSTEM_INSTRUCTION },
          { role: "user", content: buildUserPrompt(sourceData) },
        ],
        temperature: 0,
        seed: Number(process.env.AI_SEED) || 42,
        reasoning_effort: null,
        max_tokens: estimateMaxTokens(),
        response_format: { type: "json_object" },
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "api-subscription-key": apiKey,
          "Content-Type": "application/json",
        },
        timeout: 30000,
      },
    );
  } catch {
    const wrapped = new Error("AI summarization service is currently unavailable.");
    wrapped.statusCode = 502;
    throw wrapped;
  }

  const text = response.data?.choices?.[0]?.message?.content;
  if (!text) {
    const err = new Error("AI summarization returned an empty response.");
    err.statusCode = 502;
    throw err;
  }

  try {
    return JSON.parse(stripCodeFences(text));
  } catch {
    const parseErr = new Error("AI summarization returned an invalid response.");
    parseErr.statusCode = 502;
    throw parseErr;
  }
};

const sanitizeEvidenceLevel = (level) =>
  EVIDENCE_LEVELS.includes(level) ? level : "Unclear";

/**
 * Sends already-fetched real IMPPAT data plus plant identification (name,
 * scientific name, family/genus/species) to the configured AI provider,
 * which (a) writes a description from its own knowledge, (b) translates the
 * IMPPAT terms, and (c) uses its own general knowledge to identify market
 * product types and assess their claims. Throws if the provider is not
 * configured or the call fails - callers must treat that as "AI content
 * unavailable", not fall back to guessing.
 *
 * To switch AI providers, replace the callSarvam(sourceData) call below with
 * a different provider call that returns the same JSON shape - no other file
 * needs to change.
 */
export const generatePlantContent = async (sourceData) => {
  const raw = await callSarvam(sourceData);

  // Defensive check: if the AI didn't return exactly one Hindi term per
  // English term for a plant part, its Hindi translation for that part
  // can't be trusted to line up - drop it (uses_en still renders from the
  // real IMPPAT data regardless) rather than risk mislabeled terms.
  const expectedLengthByPart = new Map(
    (sourceData.traditionalUses || []).map((p) => [p.plantPart, p.uses?.length || 0])
  );
  const traditionalMedicinalUses = (raw.traditionalMedicinalUses || []).map((entry) => {
    const expected = expectedLengthByPart.get(entry.plantPart);
    const hi = Array.isArray(entry.uses_hi) ? entry.uses_hi : [];
    return {
      plantPart: entry.plantPart,
      uses_hi: hi.length === expected ? hi : [],
    };
  });

  return {
    ...raw,
    traditionalMedicinalUses,
    marketProducts: (raw.marketProducts || []).map((p) => ({
      ...p,
      evidenceLevel: sanitizeEvidenceLevel(p.evidenceLevel),
    })),
  };
};

export default { generatePlantContent };
