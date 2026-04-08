export function HeroPoster() {
  return (
    <div className="surface-strong soft-gradient relative min-h-[22rem] overflow-hidden px-6 pt-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(94,184,178,0.16),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.94),transparent_40%)]" />
      <div className="absolute -left-10 top-10 h-32 w-32 rounded-full border border-white/70 bg-[rgba(255,255,255,0.42)] backdrop-blur-xl" />
      <div className="absolute right-5 top-10 h-24 w-24 rounded-full border border-[rgba(94,184,178,0.18)]" />
      <div className="absolute bottom-0 right-0 h-48 w-44 rounded-tl-[5.5rem] bg-[rgba(94,184,178,0.12)]" />

      <div className="relative z-10">
        <div className="eyebrow">Il tuo rituale a casa</div>
        <div className="mt-4 max-w-[13rem] text-sm leading-6 text-muted">
          Sessioni brevi, tono percepibile e un passo alla volta.
        </div>
      </div>

      <svg
        viewBox="0 0 220 260"
        aria-hidden="true"
        className="absolute bottom-0 right-4 z-10 h-[17rem] w-[14rem] animate-float text-[rgba(123,90,73,0.84)]"
      >
        <circle
          cx="124"
          cy="38"
          r="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
        />
        <path
          d="M123 56C117 92 111 116 104 139C94 171 89 194 92 223"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="3.5"
        />
        <path
          d="M121 83C96 95 79 114 66 137"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="3.5"
        />
        <path
          d="M122 85C146 101 158 120 164 145"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="3.5"
        />
        <path
          d="M107 137C122 150 136 172 145 198"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="3.5"
        />
        <path
          d="M103 138C89 163 79 190 74 227"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="3.5"
        />
        <path
          d="M124 58C136 66 144 76 149 91"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="3.5"
        />
      </svg>

      <div className="absolute bottom-6 left-6 z-10 max-w-[11rem] rounded-[1.4rem] border border-white/70 bg-[rgba(255,255,255,0.68)] px-4 py-3 text-xs font-medium uppercase tracking-[0.16em] text-[rgba(97,73,61,0.82)] backdrop-blur-xl">
        Più tono. Più presenza. Più continuità.
      </div>
    </div>
  );
}
