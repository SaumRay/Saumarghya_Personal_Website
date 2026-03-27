import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface RPGStat {
  label: string;
  value: number;
  color: string;        // Tailwind bg class for filled blocks
  trackColor: string;   // Tailwind bg class for empty blocks
}

interface RPGBadge {
  label: string;
  borderColor: string;  // Tailwind border class
  textColor: string;    // Tailwind text class
}

interface RPGCardProps {
  name?: string;
  title?: string;
  subtitle?: string;
  location?: string;
  level?: number;
  archetype?: string;
  hp?: number;
  cardNumber?: string;
  stats?: RPGStat[];
  badges?: RPGBadge[];
  pixelArtSrc?: string;
}

// ─── Default data (matches your card) ────────────────────────────────────────
const DEFAULT_STATS: RPGStat[] = [
  { label: "INTELLECT",   value: 95, color: "bg-cyan-400",    trackColor: "bg-cyan-950" },
  { label: "MENTAL MATH", value: 98, color: "bg-yellow-400",  trackColor: "bg-yellow-950" },
  { label: "STRATEGY",    value: 90, color: "bg-orange-500",  trackColor: "bg-orange-950" },
  { label: "WANDERLUST",  value: 85, color: "bg-emerald-400", trackColor: "bg-emerald-950" },
  { label: "MUSIC",       value: 80, color: "bg-purple-400",  trackColor: "bg-purple-950" },
  { label: "ATHLETICISM", value: 75, color: "bg-rose-500",    trackColor: "bg-rose-950" },
];

const DEFAULT_BADGES: RPGBadge[] = [
  { label: "ALOHA CHAMP",  borderColor: "border-yellow-500", textColor: "text-yellow-400" },
  { label: "GATE AIR 590", borderColor: "border-orange-500", textColor: "text-orange-400" },
  { label: "CSE GRAD",     borderColor: "border-cyan-500",   textColor: "text-cyan-400"   },
];

// ─── Pixel art SVG (inline, matches the orange-shirt character) ───────────────
function PixelCharacter() {
  return (
    <svg
      viewBox="0 0 16 24"
      className="w-full h-full"
      style={{ imageRendering: "pixelated" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Hair / top */}
      <rect x="5" y="1" width="6" height="1" fill="#f5c842" />
      <rect x="4" y="2" width="8" height="3" fill="#f5c842" />
      {/* Face */}
      <rect x="4" y="5" width="8" height="4" fill="#f5c518" />
      {/* Eyes */}
      <rect x="5" y="6" width="2" height="2" fill="#1a1a2e" />
      <rect x="9" y="6" width="2" height="2" fill="#1a1a2e" />
      {/* Mask / scarf */}
      <rect x="4" y="8" width="8" height="3" fill="#f97316" />
      {/* Body / shirt */}
      <rect x="3" y="11" width="10" height="6" fill="#f97316" />
      {/* Arms */}
      <rect x="1" y="11" width="2" height="5" fill="#f5c518" />
      <rect x="13" y="11" width="2" height="5" fill="#f5c518" />
      {/* Hands */}
      <rect x="1" y="16" width="2" height="2" fill="#f5c518" />
      <rect x="13" y="16" width="2" height="2" fill="#f5c518" />
      {/* Pants */}
      <rect x="3" y="17" width="4" height="5" fill="#3b4fd8" />
      <rect x="9" y="17" width="4" height="5" fill="#3b4fd8" />
      {/* Shoes */}
      <rect x="3" y="22" width="4" height="2" fill="#f5c842" />
      <rect x="9" y="22" width="4" height="2" fill="#f5c842" />
    </svg>
  );
}

// ─── Animated stat bar ────────────────────────────────────────────────────────
function StatBar({
  stat,
  animate,
  delay,
}: {
  stat: RPGStat;
  animate: boolean;
  delay: number;
}) {
  const TOTAL_BLOCKS = 40;
  const filledBlocks = animate ? Math.round((stat.value / 100) * TOTAL_BLOCKS) : 0;

  return (
    <div className="flex items-center gap-3">
      {/* Label */}
      <span
        className="font-mono text-xs tracking-widest text-yellow-300/80 shrink-0"
        style={{ minWidth: "7.5rem" }}
      >
        {stat.label}
      </span>

      {/* Blocks */}
      <div className="flex gap-[2px] flex-1">
        {Array.from({ length: TOTAL_BLOCKS }).map((_, i) => (
          <motion.div
            key={i}
            className={`h-3 flex-1 rounded-sm ${
              i < filledBlocks ? stat.color : stat.trackColor
            }`}
            initial={{ opacity: 0, scaleY: 0 }}
            animate={
              animate
                ? { opacity: 1, scaleY: 1 }
                : { opacity: 0.3, scaleY: 0.5 }
            }
            transition={{
              duration: 0.06,
              delay: delay + i * 0.012,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      {/* Value */}
      <motion.span
        className="font-mono text-sm font-bold text-white shrink-0 w-7 text-right"
        initial={{ opacity: 0 }}
        animate={animate ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: delay + 0.6, duration: 0.3 }}
      >
        {stat.value}
      </motion.span>
    </div>
  );
}

// ─── Main card ────────────────────────────────────────────────────────────────
export function RPGCard({
  name = "SAUMARGHYA RAY",
  title = "THE POLYMATH",
  subtitle = "Agartala → Coimbatore  ·  XAT 98.79  ·  CAT 94.11",
  level = 23,
  archetype = "POLYMATH",
  hp = 99,
  cardNumber = "001",
  stats = DEFAULT_STATS,
  badges = DEFAULT_BADGES,
}: RPGCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [blink, setBlink] = useState(true);

  // Blink the card number tag
  useEffect(() => {
    const t = setInterval(() => setBlink((b) => !b), 700);
    return () => clearInterval(t);
  }, []);

  const nameParts = name.split(" ");
  const firstName = nameParts.slice(0, -1).join(" ");
  const lastName = nameParts[nameParts.length - 1];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="relative w-full max-w-2xl mx-auto select-none"
    >
      {/* Outer border / frame */}
      <div
        className="relative rounded-lg overflow-hidden border-4"
        style={{
          borderColor: "#f5c842",
          background: "#0d0d1a",
          boxShadow: "0 0 40px rgba(245,200,66,0.25), 0 0 80px rgba(0,240,255,0.08)",
        }}
      >
        {/* ── Top bar ── */}
        <div
          className="flex items-center justify-between px-5 py-3"
          style={{
            background: "linear-gradient(90deg,#f5c842 0%,#e6a800 100%)",
          }}
        >
          <span className="font-mono text-sm font-bold tracking-[0.2em] text-[#0d0d1a]">
            {name}
          </span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-[#0d0d1a]">HP</span>
            <div className="flex gap-[3px]">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="w-4 h-4 bg-[#0d0d1a]/80 rounded-[2px]" />
              ))}
            </div>
            <span className="font-mono text-sm font-bold text-[#0d0d1a]">{hp}</span>
          </div>
        </div>

        {/* ── Profile row ── */}
        <div className="flex gap-5 p-5 pb-4 items-start">
          {/* Pixel art portrait */}
          <div
            className="shrink-0 rounded-md overflow-hidden border-2 border-yellow-500"
            style={{
              width: 96,
              height: 128,
              background: "#1a1f3a",
              padding: "8px",
            }}
          >
            <PixelCharacter />
          </div>

          {/* Name + badges */}
          <div className="flex flex-col gap-2 justify-center pt-1 flex-1">
            <div>
              <h3 className="font-mono text-2xl font-bold text-white leading-tight tracking-wide">
                {firstName}
                <br />
                {lastName}
              </h3>
            </div>

            <div className="flex items-center gap-2 mt-1">
              <span className="text-yellow-500 text-xs">✦</span>
              <span className="font-mono text-xs font-bold text-yellow-400 tracking-[0.18em]">
                {title}
              </span>
              <span className="text-yellow-500 text-xs">✦</span>
            </div>

            <p className="font-mono text-xs text-white/40 tracking-wide">
              {subtitle}
            </p>

            <div className="flex flex-wrap gap-2 mt-2">
              {badges.map((badge) => (
                <span
                  key={badge.label}
                  className={`font-mono text-[10px] font-bold tracking-widest px-3 py-1 rounded border ${badge.borderColor} ${badge.textColor} bg-transparent`}
                >
                  {badge.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="mx-5 h-px bg-yellow-500/20" />

        {/* ── Stats ── */}
        <div className="px-5 py-5 space-y-3">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-xs text-yellow-500/60 tracking-[0.3em]">──</span>
            <span className="font-mono text-xs font-bold text-yellow-500/80 tracking-[0.3em]">
              STATS
            </span>
            <span className="font-mono text-xs text-yellow-500/60 tracking-[0.3em] flex-1">
              {"─".repeat(24)}
            </span>
          </div>

          {stats.map((stat, idx) => (
            <StatBar
              key={stat.label}
              stat={stat}
              animate={isInView}
              delay={0.3 + idx * 0.08}
            />
          ))}
        </div>

        {/* ── Divider ── */}
        <div className="mx-5 h-px bg-yellow-500/20" />

        {/* ── Footer ── */}
        <div className="flex items-center justify-between px-5 py-4">
          <div
            className="font-mono text-xs font-bold tracking-widest px-4 py-2 rounded border border-yellow-500 text-yellow-400"
            style={{ background: "rgba(245,200,66,0.08)" }}
          >
            LVL {level} {archetype}
          </div>

          {/* Blinking card tag */}
          <motion.div
            animate={{ opacity: blink ? 1 : 0 }}
            transition={{ duration: 0.1 }}
            className="font-mono text-[10px] font-bold tracking-widest text-yellow-500/50"
          >
            CARD #{cardNumber.padStart(3, "0")}
          </motion.div>
        </div>

        {/* ── Corner screws ── */}
        {[
          "top-2 left-2",
          "top-2 right-2",
          "bottom-2 left-2",
          "bottom-2 right-2",
        ].map((pos) => (
          <div
            key={pos}
            className={`absolute ${pos} w-2 h-2 rounded-full border border-yellow-500/40`}
          />
        ))}
      </div>

      {/* Glow halo behind card */}
      <div
        className="absolute inset-0 -z-10 rounded-xl blur-3xl opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(245,200,66,0.4) 0%, transparent 70%)",
        }}
      />
    </motion.div>
  );
}