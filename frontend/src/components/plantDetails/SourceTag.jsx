const SourceTag = ({ source }) =>
  source ? (
    <a
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block rounded-full border border-white/30 px-3 py-0.5 text-xs text-gray-400 hover:text-green-500 hover:border-green-500 transition-colors duration-300"
    >
      Source: {source.name}
    </a>
  ) : null;

export default SourceTag;
