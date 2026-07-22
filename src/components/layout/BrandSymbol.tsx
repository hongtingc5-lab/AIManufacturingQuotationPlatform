/** Shared brand mark SVG used in header/footer */
export function BrandSymbol() {
  return (
    <svg className="brand-symbol" viewBox="0 0 56 58" aria-hidden="true" focusable="false">
      <path
        className="brand-symbol-secondary"
        d="M28 3 4 17l9.8 5.7L28 14.5l14.2 8.2L52 17 28 3Z"
      />
      <path
        className="brand-symbol-primary"
        d="M2 20.8 28 36l26-15.2v29.4l-9.8 5.7V37.7L28 47 11.8 37.7v18.2L2 50.2V20.8Z"
      />
      <path className="brand-symbol-secondary" d="M17 42.7 28 49l11-6.3v8.8L28 58l-11-6.5v-8.8Z" />
    </svg>
  )
}
