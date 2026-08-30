import type { SVGProps } from "react"

interface LexGuardLogoProps extends SVGProps<SVGSVGElement> {
  variant?: "full" | "mark"
}

export function LexGuardLogo({ variant = "full", className, ...props }: LexGuardLogoProps) {
  const showWordmark = variant === "full"
  return (
    <svg
      viewBox={showWordmark ? "0 0 244 64" : "0 0 64 64"}
      role="img"
      aria-label="LexGuard AI"
      className={className}
      {...props}
    >
      <title>LexGuard AI</title>
      <defs>
        <linearGradient id="lexguard-shield" x1="8" y1="56" x2="55" y2="8" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4268c7" />
          <stop offset="1" stopColor="#59d5bd" />
        </linearGradient>
        <linearGradient id="lexguard-wordmark" x1="94" y1="18" x2="221" y2="52" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4778bd" />
          <stop offset="1" stopColor="#60d9c1" />
        </linearGradient>
      </defs>
      <g transform="translate(2 2)">
        <path d="M30 1 57 13v20c0 16-10.5 25.7-27 29C13.5 58.7 3 49 3 33V13L30 1Z" fill="url(#lexguard-shield)" opacity=".18" />
        <path d="M30 4 54 15v18c0 13.5-8 22.4-24 26-16-3.6-24-12.5-24-26V15L30 4Z" fill="none" stroke="url(#lexguard-shield)" strokeWidth="3" />
        <path d="M30 12 46 19v14c0 9-5 15.3-16 18-11-2.7-16-9-16-18V19l16-7Z" fill="#142f3a" stroke="#59d5bd" strokeWidth="1.5" opacity=".95" />
        <path d="M22 21h13l5 5v14H22V21Z" fill="none" stroke="#c8f3e8" strokeWidth="1.8" />
        <path d="M35 21v6h5M25 27h9M25 31h11M25 35h7" fill="none" stroke="#c8f3e8" strokeWidth="1.5" />
        <circle cx="25" cy="39" r="8" fill="#183745" stroke="#82e6d0" strokeWidth="2" />
        <path d="m30.5 45 6 6" stroke="#82e6d0" strokeWidth="3" strokeLinecap="round" />
        <path d="m41 37-5 8m0-8 5 8" stroke="#65d6c0" strokeWidth="2" strokeLinecap="round" />
      </g>
      {showWordmark ? <g fontFamily="Arial, sans-serif" fontWeight="700" letterSpacing="-1">
        <text x="73" y="35" fontSize="27" fill="url(#lexguard-wordmark)">LexGuard</text>
        <text x="74" y="57" fontSize="25" fill="#54d4c0" letterSpacing="1">AI.</text>
      </g> : null}
    </svg>
  )
}

export function LexGuardMark(props: Omit<LexGuardLogoProps, "variant">) {
  return <LexGuardLogo variant="mark" {...props} />
}

export function LexGuardWordmark(props: Omit<LexGuardLogoProps, "variant">) {
  return <LexGuardLogo variant="full" {...props} />
}

export default LexGuardLogo
