import { Heart } from "lucide-react";

// EKG heartbeat SVG path
function EkgLine({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 800 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="none"
    >
      <path
        d="M0 30 L120 30 L140 30 L155 10 L170 50 L185 5 L200 55 L215 30 L240 30 L260 30 L275 20 L285 38 L295 30 L400 30 L420 30 L435 12 L450 48 L465 6 L480 54 L495 30 L520 30 L540 30 L555 22 L565 38 L575 30 L700 30 L800 30"
        stroke="#7B4435"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.35"
      />
    </svg>
  );
}

// Medical cross icon (white, solid square background)
function MedicalCross({ size = 36 }: { size?: number }) {
  return (
    <span
      style={{ width: size, height: size, fontSize: size * 0.7 }}
      className="inline-flex items-center justify-center bg-[#7B4435] rounded-sm text-white font-black leading-none select-none"
    >
      ✚
    </span>
  );
}

export function Hero() {
  return (
    <div className="relative min-h-screen bg-white overflow-hidden flex flex-col items-center justify-center font-sans">

      {/* ── Corner geometric shapes ── */}

      {/* Top-right — light blush angled band */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: -60,
          right: -80,
          width: 340,
          height: 380,
          background: "rgba(196,166,154,0.18)",
          transform: "rotate(-18deg)",
          borderRadius: 8,
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          top: 40,
          right: -40,
          width: 200,
          height: 320,
          background: "rgba(196,166,154,0.12)",
          transform: "rotate(-18deg)",
          borderRadius: 8,
        }}
      />

      {/* Bottom-left — deeper mocha blush shape */}
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: -80,
          left: -60,
          width: 280,
          height: 300,
          background: "rgba(180,130,110,0.22)",
          transform: "rotate(-18deg)",
          borderRadius: 8,
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: 20,
          left: -30,
          width: 160,
          height: 200,
          background: "rgba(196,166,154,0.15)",
          transform: "rotate(-18deg)",
          borderRadius: 8,
        }}
      />

      {/* Bottom-right — subtle blush accent */}
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: -40,
          right: -30,
          width: 180,
          height: 220,
          background: "rgba(196,166,154,0.13)",
          transform: "rotate(-18deg)",
          borderRadius: 8,
        }}
      />

      {/* ── EKG line — top ── */}
      <div className="absolute top-6 left-0 w-[58%] pointer-events-none">
        <EkgLine className="w-full h-10" />
      </div>

      {/* ── EKG line — bottom-right ── */}
      <div className="absolute bottom-8 right-0 w-[52%] pointer-events-none opacity-70">
        <EkgLine className="w-full h-8" />
      </div>

      {/* ── Main centered content ── */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 gap-6">

        {/* Circular logo badge */}
        <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-[#C4A69A]/40 shadow-sm">
          <img
            src="/__mockup/images/logo.png"
            alt="Quaccoo Medical Doctor"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Bold all-caps wordmark */}
        <div className="flex flex-col items-center leading-none gap-1">
          <h1
            className="text-[#5C2E2E] font-black uppercase tracking-wider"
            style={{ fontSize: "clamp(2.8rem, 6vw, 5.5rem)", lineHeight: 1.05, fontFamily: "'Montserrat', sans-serif" }}
          >
            TOBAGO EAST
          </h1>
          <h1
            className="text-[#5C2E2E] font-black uppercase tracking-wider flex items-center gap-3"
            style={{ fontSize: "clamp(2.8rem, 6vw, 5.5rem)", lineHeight: 1.05, fontFamily: "'Montserrat', sans-serif" }}
          >
            MEDICAL&nbsp;<MedicalCross size={Math.round(5.5 * 14 * 0.8)} />
          </h1>
          <h1
            className="text-[#5C2E2E] font-black uppercase tracking-wider"
            style={{ fontSize: "clamp(2.8rem, 6vw, 5.5rem)", lineHeight: 1.05, fontFamily: "'Montserrat', sans-serif" }}
          >
            SERVICES
          </h1>
        </div>

        {/* Tagline with decorative rules */}
        <div className="flex items-center gap-4 mt-2">
          <div className="h-px bg-[#7B4435]/30 w-16" />
          <p
            className="text-[#7B4435]/80 font-semibold tracking-[0.22em] text-xs uppercase"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            For Your Health, Wellness &amp; Much More
          </p>
          <div className="h-px bg-[#7B4435]/30 w-16" />
        </div>

        {/* CTA button */}
        <button
          className="mt-3 inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-white font-semibold text-sm tracking-wide transition-opacity hover:opacity-90"
          style={{ background: "#6B3A2A", fontFamily: "'Montserrat', sans-serif" }}
        >
          <Heart className="w-4 h-4 fill-white" />
          Book an Appointment
        </button>
      </div>
    </div>
  );
}
