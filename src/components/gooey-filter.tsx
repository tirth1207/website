export default function GooeyFilter({ id = "gooey" }: { id?: string }) {
  // Keep this component server-compatible; it's just an SVG defs block
  return (
    <svg aria-hidden="true" className="absolute inset-0 h-0 w-0">
      <defs>
        <filter id={id}>
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="1 0 0 0 0 
                    0 1 0 0 0 
                    0 0 1 0 0 
                    0 0 0 18 -10"
            result="goo"
          />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </defs>
    </svg>
  )
}
