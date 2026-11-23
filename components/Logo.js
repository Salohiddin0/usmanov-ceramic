// B variant logo: "U" harfi shaklidagi kosa
export function Mark({ size = 38 }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} aria-hidden="true">
      <rect x="8" y="28" width="104" height="10" rx="5" fill="#0fb5ae" />
      <path d="M14 42 Q16 104 60 104 Q104 104 106 42 Z M38 42 Q40 80 60 80 Q80 80 82 42 Z" fill="#3d6bff" fillRule="evenodd" />
      <circle cx="27" cy="58" r="3.2" fill="#ffb020" />
      <circle cx="93" cy="58" r="3.2" fill="#ffb020" />
      <circle cx="60" cy="62" r="8" fill="#ffb020" />
      <rect x="44" y="104" width="32" height="8" rx="3" fill="#3d6bff" />
    </svg>
  );
}

export default function Logo({ title = 'Usmanov', sub = 'CERAMIC' }) {
  return (
    <>
      <Mark />
      <span className="lw">
        <b>{title}</b>
        <small>{sub}</small>
      </span>
    </>
  );
}
