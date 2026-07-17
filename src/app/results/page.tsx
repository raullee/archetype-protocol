"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Archetype, ARCHETYPE_DATA } from "@/lib/archetypes";
import { getTopArchetypes, ArchetypeResult } from "@/utils/calculateArchetype";
import {
  Lock, Twitter, MessageCircle, ArrowRight, Copy, Check,
  Crown, Palette, Heart, Sun, BookOpen, Compass, Zap, Sparkles,
  Shield, HeartHandshake, Laugh, Users, Loader2, Clock, Timer,
} from "lucide-react";
import Link from "next/link";
import { trackArchetypeResultView, trackPaymentClick, trackShareResult, trackCtaClick } from "@/lib/analytics";
import type { PricingPayload } from "@/lib/pricing";
import { pricingPayload } from "@/lib/pricing";

const ICON_MAP: Record<string, React.ElementType> = {
  Crown, Palette, Heart, Sun, BookOpen, Compass, Zap, Sparkles, Shield, HeartHandshake, Laugh, Users,
};

const SHAPE_COLORS = ["#D02020", "#1040C0", "#F0C020"];


// ── Locked section data with curiosity-gap teasers ────────────────────
const LOCKED_SECTIONS: Record<Archetype, { title: string; teaser: string; preview: string }[]> = (() => {
  const base = (a: Archetype) => [
    {
      title: "Your Relationship Blind Spot",
      teaser: `Your biggest relationship mistake is trusting...`,
      preview: `As a ${a}, your tendency to ${a === "Sage" ? "intellectualize emotions" : a === "Ruler" ? "lead rather than listen" : a === "Caregiver" ? "over-give at your own expense" : a === "Explorer" ? "prioritize freedom over intimacy" : a === "Creator" ? "retreat into your inner world" : a === "Hero" ? "fix rather than feel" : a === "Outlaw" ? "test boundaries destructively" : a === "Magician" ? "enchant rather than be vulnerable" : a === "Lover" ? "lose yourself in the other person" : a === "Jester" ? "deflect with humor" : a === "Innocent" ? "avoid difficult conversations" : "blend in rather than speak up"} creates a pattern your partners find deeply frustrating. The specific trigger that damages your relationships most is when you unconsciously...`,
    },
    {
      title: "Career Alignment Analysis",
      teaser: `The career path most people like you regret not...`,
      preview: `Your ${a} archetype maps to 5 high-alignment career paths with a predicted satisfaction score of 87%. The role you're most likely to thrive in requires autonomy and creative problem-solving. Industry analysis shows ${a}s earn 23% more when aligned with their archetype-matched career compared to...`,
    },
    {
      title: "Your Shadow Archetype",
      teaser: `Under stress, you unconsciously become the exact...`,
      preview: `Every ${a} carries a shadow that emerges under pressure. Your shadow manifests as the opposite of your greatest strength \u2014 the very quality others admire in you becomes weaponized. When triggered, you shift into a pattern of behavior that feels completely justified but is actually...`,
    },
    {
      title: "Personal Growth Roadmap",
      teaser: `The single habit that would transform your ${a} energy into...`,
      preview: `Phase 1 (Weeks 1-4): Recognize the core pattern \u2014 your tendency to default to your ${a} strength even when the situation calls for something different. The specific daily practice that unlocks growth for ${a}s involves a 5-minute exercise that rewires your instinctive response to...`,
    },
    {
      title: "Decision-Making Style",
      teaser: `You make 73% of your decisions using a pattern that...`,
      preview: `${a}s process decisions through a distinctive framework that prioritizes ${a === "Sage" ? "logical analysis" : a === "Ruler" ? "control and outcome certainty" : a === "Caregiver" ? "impact on others" : a === "Explorer" ? "novelty and freedom" : a === "Creator" ? "aesthetic and originality" : a === "Hero" ? "moral alignment" : "instinct"} over competing factors. This creates a blind spot in situations requiring rapid emotional assessment. Your decision accuracy drops by an estimated 40% when...`,
    },
    {
      title: "\u2728 Character Arc Engine",
      teaser: `Your musical hero's journey follows a predictable pattern that...`,
      preview: `Your ${a} archetype follows a specific narrative arc in the creative life. Most ${a} musicians experience breakthrough moments when they realize their greatest strength can become their greatest weakness. Your character arc reveals the three major creative phases you'll move through, the shadow you must integrate, and the specific way your personality type achieves artistic mastery. Combined with HEXACO personality data, this creates a complete roadmap for...`,
    },
  ];
  const all: Record<string, { title: string; teaser: string; preview: string }[]> = {};
  const archetypes: Archetype[] = ["Ruler","Creator","Caregiver","Innocent","Sage","Explorer","Outlaw","Magician","Hero","Lover","Jester","Everyman"];
  archetypes.forEach(a => { all[a] = base(a); });
  return all as Record<Archetype, { title: string; teaser: string; preview: string }[]>;
})();

// ── Archetype-specific insight sentences (free section) ───────────────
const ARCHETYPE_INSIGHTS: Record<Archetype, { personality: string; topStrength: string; blindSpot: string }> = {
  Ruler: {
    personality: "You operate with a rare combination of strategic vision and commanding presence. People naturally look to you for direction, not because you demand it, but because you radiate competence and clarity. Your mind instinctively organizes chaos into systems \u2014 you don't just lead, you architect outcomes.",
    topStrength: "Strategic command \u2014 you see the endgame when others are still figuring out the rules. Your ability to organize people and resources toward a vision makes you indispensable in any high-stakes environment.",
    blindSpot: "You struggle to relinquish control even when delegation would produce better results. Your need for authority can create invisible walls between you and the honest feedback you desperately need.",
  },
  Creator: {
    personality: "Your mind doesn\u2019t follow paths \u2014 it builds them. You experience the world as raw material waiting to be shaped, and you feel most alive in the act of making something new. Routine is your kryptonite; novelty is your oxygen.",
    topStrength: "Original vision \u2014 you see possibilities in blank spaces that others walk right past. Your ability to synthesize disparate ideas into something wholly new is genuinely rare and commercially valuable.",
    blindSpot: "Perfectionism masquerades as high standards, but it\u2019s actually fear. You abandon more brilliant ideas halfway through than most people ever have, because the gap between your vision and execution feels unbearable.",
  },
  Caregiver: {
    personality: "You possess an almost supernatural ability to sense what others need before they ask. Your empathy isn\u2019t just emotional \u2014 it\u2019s strategic. You read rooms, anticipate problems, and quietly ensure everyone around you is supported.",
    topStrength: "Emotional intelligence \u2014 you build trust faster than anyone in the room. People confide in you, follow you, and remain loyal to you because they feel genuinely seen in your presence.",
    blindSpot: "You give until you\u2019re empty, then resent the people you chose to serve. Your boundaries are porous, and you interpret setting limits as selfishness \u2014 which is exactly the belief that leads to your burnout cycles.",
  },
  Innocent: {
    personality: "Your authenticity is disarming in a world of performance. You carry a genuine belief in human goodness that others find both refreshing and magnetic. Where cynics see problems, you see possibilities \u2014 and you\u2019re right more often than they\u2019d like to admit.",
    topStrength: "Radical authenticity \u2014 you create psychological safety simply by being present. People lower their defenses around you because your optimism is contagious and your sincerity is unmistakable.",
    blindSpot: "You avoid necessary conflict until it becomes unavoidable crisis. Your desire to maintain harmony means you sometimes tolerate situations that are genuinely harmful to you, mistaking endurance for grace.",
  },
  Sage: {
    personality: "You process the world through understanding. Where others react, you analyze. Where others assume, you investigate. Your need for truth isn\u2019t academic \u2014 it\u2019s existential. Knowledge is how you make the world feel safe and navigable.",
    topStrength: "Deep analytical clarity \u2014 you cut through noise and complexity to find the signal. When everyone else is confused or panicking, you\u2019re the one who identifies the real problem and the real solution.",
    blindSpot: "You retreat into your head when life demands you be in your heart. Your tendency to intellectualize emotions creates a subtle disconnection in your closest relationships that you may not even notice until it\u2019s too late.",
  },
  Explorer: {
    personality: "Freedom isn\u2019t a preference for you \u2014 it\u2019s a biological imperative. You wither in environments that restrict your movement, choices, or growth. Your restlessness isn\u2019t a flaw; it\u2019s the engine that drives you toward discoveries others never make.",
    topStrength: "Adaptive courage \u2014 you thrive in uncertainty that paralyzes others. Your willingness to venture into the unknown, combined with your resourcefulness, means you accumulate experiences and skills at an extraordinary rate.",
    blindSpot: "You conflate commitment with captivity. The moment a relationship, job, or place starts feeling routine, an alarm goes off inside you \u2014 and you don\u2019t always stop to ask whether the alarm is wisdom or fear.",
  },
  Outlaw: {
    personality: "You see the invisible rules that govern everyone else\u2019s behavior \u2014 and you refuse to follow them blindly. Your rebelliousness isn\u2019t random; it\u2019s targeted at systems you perceive as unjust, outdated, or dishonest. You\u2019d rather be disliked for truth than loved for compliance.",
    topStrength: "Fearless truth-telling \u2014 you say what everyone else is thinking but won\u2019t voice. In organizations and relationships, you\u2019re the one who names the elephant in the room, which makes you invaluable to anyone brave enough to listen.",
    blindSpot: "You can become so identified with being \u2018against\u2019 things that you forget to build something worth being \u2018for.\u2019 Your oppositional energy, unchecked, destroys alliances you actually need to create the change you want.",
  },
  Magician: {
    personality: "You operate on a different plane of awareness than most people. You intuitively understand how to shift energy, reframe perspectives, and catalyze transformation in others. People leave conversations with you seeing the world differently \u2014 and they can\u2019t always explain why.",
    topStrength: "Transformative influence \u2014 you have a rare ability to help people see beyond their current limitations. Your vision and charisma combine to make the impossible feel not just possible, but inevitable.",
    blindSpot: "Your gift for influence has a dark edge: you can manipulate without realizing it. When your vision becomes more important than others\u2019 autonomy, your charisma becomes a tool of control rather than liberation.",
  },
  Hero: {
    personality: "You were built for adversity. Where others see obstacles, you see proving grounds. Your identity is forged in the fires of challenge, and you derive deep meaning from overcoming what others consider impossible. Quitting isn\u2019t in your vocabulary.",
    topStrength: "Indomitable resilience \u2014 you don\u2019t just endure hardship, you transmute it into strength. Your ability to keep moving forward inspires everyone watching, and your grit has a compounding effect that others consistently underestimate.",
    blindSpot: "You need enemies to feel alive. Without a battle to fight, you create one \u2014 in your relationships, your career, even within yourself. Rest feels like surrender, and you don\u2019t realize that your inability to be at peace is itself the dragon you need to slay.",
  },
  Lover: {
    personality: "You experience life at full emotional voltage. Beauty, connection, and passion aren\u2019t luxuries for you \u2014 they\u2019re necessities. You form bonds of extraordinary depth and bring an intensity of feeling that transforms every relationship you enter.",
    topStrength: "Emotional depth \u2014 you create connections that others describe as life-changing. Your capacity for intimacy, vulnerability, and passionate commitment makes you an irreplaceable presence in the lives of those you love.",
    blindSpot: "You lose yourself in others. Your identity becomes entangled with your relationships to the point where you can\u2019t distinguish your own needs from your partner\u2019s. When love ends, you don\u2019t just lose a person \u2014 you lose your sense of self.",
  },
  Jester: {
    personality: "You understand something most people miss: life is absurd, and the healthiest response to absurdity is laughter. Your humor isn\u2019t superficial \u2014 it\u2019s a form of wisdom. You disarm tension, reveal hypocrisy, and create joy in spaces that desperately need it.",
    topStrength: "Social alchemy \u2014 you transform the energy of any room you enter. Your ability to make people laugh creates psychological safety, breaks down barriers, and makes you someone people actively seek out during their hardest moments.",
    blindSpot: "Your humor is also your armor. You use laughter to avoid pain, deflect vulnerability, and maintain distance from emotions that feel too heavy to carry. The people closest to you sense there\u2019s a deeper you that you won\u2019t let them reach.",
  },
  Everyman: {
    personality: "Your superpower is the one most overlooked: genuine relatability. You meet people exactly where they are, without pretension or agenda. In a world obsessed with standing out, your ability to make others feel they belong is quietly revolutionary.",
    topStrength: "Universal connection \u2014 you build bridges between people who would otherwise never understand each other. Your groundedness and authenticity create a gravity that holds groups together through conflict and change.",
    blindSpot: "You\u2019ve become so skilled at fitting in that you\u2019ve forgotten what it feels like to stand out. Your fear of seeming \u2018too much\u2019 keeps you playing small, and the world is missing the full version of you that you\u2019ve been too cautious to reveal.",
  },
};

// ── Radar chart (SVG) ─────────────────────────────────────────────────
function RadarChart({ scores }: { scores: ArchetypeResult[] }) {
  const topScores = scores.filter((s) => s.score > 0).slice(0, 8);
  if (topScores.length < 3) return null;

  const cx = 150, cy = 150, maxR = 110;
  const maxScore = topScores[0].score;
  const n = topScores.length;

  const pointsOuter = topScores.map((_, i) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    return { x: cx + maxR * Math.cos(angle), y: cy + maxR * Math.sin(angle) };
  });

  const pointsData = topScores.map((s, i) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const r = (s.score / maxScore) * maxR;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  });

  const dataPath = pointsData.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";

  return (
    <div className="flex justify-center">
      <svg viewBox="0 0 300 300" className="w-full max-w-[280px]">
        {/* White background */}
        <rect x="0" y="0" width="300" height="300" fill="#FFFFFF" />
        {/* Grid rings */}
        {[0.25, 0.5, 0.75, 1].map((scale) => (
          <polygon
            key={scale}
            points={topScores
              .map((_, i) => {
                const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
                return `${cx + maxR * scale * Math.cos(angle)},${cy + maxR * scale * Math.sin(angle)}`;
              })
              .join(" ")}
            fill="none"
            stroke="#121212"
            strokeWidth={scale === 1 ? "2" : "1"}
            opacity={scale === 1 ? 0.3 : 0.15}
          />
        ))}
        {/* Axis lines */}
        {pointsOuter.map((p, i) => (
          <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#121212" strokeWidth="1" opacity="0.1" />
        ))}
        {/* Data polygon */}
        <motion.polygon
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          points={pointsData.map((p) => `${p.x},${p.y}`).join(" ")}
          fill="rgba(208,32,32,0.15)"
          stroke="#D02020"
          strokeWidth="3"
          strokeDasharray="1000"
          strokeDashoffset="1000"
          style={{ transformOrigin: `${cx}px ${cy}px`, animation: 'radar-trace 2s ease-out 0.5s forwards' }}
        />
        {/* Data points */}
        {pointsData.map((p, i) => (
          <motion.circle
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 + i * 0.05 }}
            cx={p.x} cy={p.y} r="5"
            fill={SHAPE_COLORS[i % 3]}
            stroke="#121212" strokeWidth="2"
          />
        ))}
        {/* Labels */}
        {topScores.map((s, i) => {
          const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
          const labelR = maxR + 24;
          const lx = cx + labelR * Math.cos(angle);
          const ly = cy + labelR * Math.sin(angle);
          return (
            <text
              key={i}
              x={lx} y={ly}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-[#121212]/60 text-[10px]"
              style={{ fontFamily: "var(--font-outfit), 'Outfit', sans-serif", textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}
            >
              {s.archetype}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

// ── Main results content ──────────────────────────────────────────────
function ResultsContent() {
  const searchParams = useSearchParams();
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedTier, setSelectedTier] = useState<"basic" | "full">("full");
  // Geo-resolved pricing (MYR in Malaysia, USD elsewhere). Fetched rather than
  // rendered server-side because the price must never be cached per-region.
  // On failure we fall back to the GLOBAL USD tier, never the local one -- fail
  // to the higher price, so a geo outage can't hand the world ringgit rates.
  const [pricing, setPricing] = useState<PricingPayload | null>(null);
  // Bundle unlock state — populated from localStorage flag set by BundleRedeemer.
  // null = not yet checked (SSR), undefined = no unlock, string = sessionId of valid bundle.
  const [bundleSessionId, setBundleSessionId] = useState<string | null | undefined>(null);

  const answersParam = searchParams.get("a") || searchParams.get("archetypes") || "";
  const answers = answersParam.split(",").filter(Boolean) as Archetype[];
  const quizSeconds = parseInt(searchParams.get("t") || "0", 10);

  const result = answers.length > 0 ? getTopArchetypes(answers) : null;

  // Persist the full 12-way resonance profile so the paid report can be written
  // from the reader's whole spectrum, not just their top two. This must go via
  // localStorage because the Stripe checkout redirect strips everything except
  // the archetypes in the success_url; localStorage survives the round-trip.
  useEffect(() => {
    if (!result) return;
    try {
      const profile = result.all.map((r) => ({ archetype: r.archetype, percentage: r.percentage }));
      localStorage.setItem("ap_profile", JSON.stringify(profile));
    } catch { /* private mode / quota — report falls back to top-2 */ }
  }, [result]);

  // Read bundle unlock from localStorage on mount. BundleRedeemer in the layout sets this
  // after a successful /api/redeem-bundle round-trip.
  useEffect(() => {
    try {
      const raw = localStorage.getItem("ap_bundle_unlock");
      if (!raw) { setBundleSessionId(undefined); return; }
      const parsed = JSON.parse(raw) as { sessionId?: string };
      setBundleSessionId(parsed?.sessionId || undefined);
    } catch {
      setBundleSessionId(undefined);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setRevealed(true);
      if (result) {
        trackArchetypeResultView(result.primary.archetype, result.secondary.archetype);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetch("/api/pricing")
      .then((r) => r.json())
      .then(setPricing)
      .catch(() => setPricing(pricingPayload(null)));
  }, []);

  const handleCheckout = useCallback((tier: "basic" | "full") => {
    const amount = pricing ? (pricing.tiers[tier].minorUnits / 100).toFixed(2) : "0";
    trackPaymentClick(tier, amount, result ? result.primary.archetype : "Unknown", pricing?.currency);
    // Currency and amount are decided server-side from edge geo; sending them
    // from here would let the browser pick its own price.
    fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        archetypes: result ? [result.primary.archetype, result.secondary.archetype] : [],
        tier,
      }),
    })
      .then((r) => r.json())
      .then((data) => { if (data.url) window.location.href = data.url; })
      .catch(console.error);
  }, [result, pricing]);

  if (!result) {
    return (
      <div className="min-h-screen bg-[#F0F0F0] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#121212]/50 mb-4 font-medium">No results found.</p>
          <Link href="/test" className="text-[#D02020] font-bold uppercase">Take the quiz</Link>
        </div>
      </div>
    );
  }

  const primary = result.primary;
  const secondary = result.secondary;
  const PrimaryIcon = ICON_MAP[primary.data.icon] || Sparkles;
  const insights = ARCHETYPE_INSIGHTS[primary.archetype];
  const lockedSections = LOCKED_SECTIONS[primary.archetype];
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    trackShareResult("copy_link", primary.archetype);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatQuizTime = () => {
    if (!quizSeconds) return null;
    const m = Math.floor(quizSeconds / 60);
    const s = quizSeconds % 60;
    return `${m}m ${s.toString().padStart(2, "0")}s`;
  };

  return (
    <div className="min-h-screen bg-[#F0F0F0]">
      {/* The Reveal */}
      <AnimatePresence>
        {!revealed && (
          <motion.div exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-[#1040C0] flex items-center justify-center overflow-hidden">
            {/* Geometric decorations */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, duration: 1, ease: "easeOut" }}
              className="absolute top-[15%] left-[10%] w-20 h-20 bg-[#D02020] border-4 border-white/30"
            />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, duration: 1, ease: "easeOut" }}
              className="absolute bottom-[20%] right-[15%] w-16 h-16 rounded-full bg-[#F0C020] border-4 border-white/30"
            />
            <motion.div className="text-center relative z-10">
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
                className="mb-6 w-20 h-20 border-4 border-white mx-auto flex items-center justify-center bg-white/10"
              >
                <PrimaryIcon className="w-10 h-10 text-white" />
              </motion.div>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="bauhaus-label text-white/60 mb-4">
                You are
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3, duration: 0.8 }}
                className="font-black text-5xl sm:text-7xl uppercase tracking-tighter text-white"
              >
                The {primary.archetype}
              </motion.h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }} className="text-[#F0C020] mt-4 text-lg font-bold uppercase tracking-wider">
                {primary.data.tagline}
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: revealed ? 1 : 0 }} transition={{ duration: 0.8 }}>
        {/* Header bar */}
        <div className="fixed top-0 left-0 right-0 z-40 bg-white border-b-4 border-[#121212]">
          <div className="max-w-3xl mx-auto px-6 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2 bauhaus-label text-[#121212]/50">
              <Clock className="w-3 h-3" />
              <span>Your archetype analysis</span>
            </div>
            {formatQuizTime() && (
              <div className="flex items-center gap-2 bauhaus-label text-[#121212]/40">
                <Timer className="w-3 h-3" />
                <span>Completed in {formatQuizTime()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Header */}
        <div className="pt-24 pb-12 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white border-2 border-[#121212] shadow-hard-sm px-4 py-2 mb-8">
              <PrimaryIcon className="w-5 h-5 text-[#D02020]" />
              <span className="bauhaus-label text-[#121212]/50">Your Core Archetype</span>
            </div>
            <h1 className="font-black text-5xl sm:text-6xl uppercase tracking-tighter mb-4">The <span className="text-[#D02020]">{primary.archetype}</span></h1>

            {/* Archetype badges */}
            <div className="flex items-center justify-center gap-3 mb-8 flex-wrap">
              <span className="px-4 py-2 text-sm font-bold uppercase tracking-wider border-2 border-[#121212] bg-[#D02020] text-white shadow-hard-sm">
                Primary: {primary.archetype}
              </span>
              {secondary.score > 0 && (
                <span className="px-4 py-2 text-sm font-bold uppercase tracking-wider border-2 border-[#121212] bg-white text-[#121212]/60 shadow-hard-sm flex items-center gap-2">
                  Secondary: {secondary.archetype}
                  <Lock className="w-3 h-3 text-[#121212]/30" />
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── FREE: Personality Deep-Dive ─────────────────────────────── */}
        <section className="pb-12 px-6">
          <div className="max-w-2xl mx-auto bauhaus-card p-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 bg-[#D02020]" />
              <h3 className="bauhaus-label text-[#D02020]">Your Personality Profile</h3>
            </div>
            <p className="text-[#121212]/60 leading-relaxed text-[15px] font-medium">{insights.personality}</p>
          </div>
        </section>

        {/* ── FREE: #1 Strength & #1 Blind Spot ──────────────────────── */}
        <section className="pb-12 px-6">
          <div className="max-w-2xl mx-auto grid sm:grid-cols-2 gap-6">
            <div className="bauhaus-card p-8 relative">
              <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-[#1040C0]" />
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 border-2 border-[#121212] bg-[#1040C0]/10 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[#1040C0]" />
                </div>
                <h3 className="font-bold text-[#1040C0] uppercase">#1 Strength</h3>
              </div>
              <p className="text-sm text-[#121212]/50 leading-relaxed font-medium">{insights.topStrength}</p>
            </div>
            <div className="bauhaus-card p-8 relative">
              <div className="absolute top-3 right-3 w-3 h-3 bg-[#F0C020]" />
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 border-2 border-[#121212] bg-[#F0C020]/10 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-[#F0C020]" />
                </div>
                <h3 className="font-bold text-[#121212] uppercase">#1 Blind Spot</h3>
              </div>
              <p className="text-sm text-[#121212]/50 leading-relaxed font-medium">{insights.blindSpot}</p>
            </div>
          </div>
        </section>

        {/* ── FREE: Radar Chart ──────────────────────────────────────── */}
        <section className="pb-12 px-6">
          <div className="max-w-2xl mx-auto bauhaus-card p-10">
            <h3 className="font-bold text-lg mb-6 text-center uppercase tracking-tighter">Your Archetype Spectrum</h3>
            <RadarChart scores={result.all} />
            {/* Bar fallback */}
            <div className="mt-8 space-y-3">
              {result.all.slice(0, 6).filter((r: ArchetypeResult) => r.score > 0).map((r: ArchetypeResult, idx: number) => {
                const maxScore = result.all[0].score;
                const width = (r.score / maxScore) * 100;
                return (
                  <div key={r.archetype} className="flex items-center gap-4">
                    <span className="bauhaus-label text-[#121212]/50 w-20 text-right text-[10px]">{r.archetype}</span>
                    <div className="flex-1 h-3 bg-[#E0E0E0] border-2 border-[#121212] overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${width}%` }} transition={{ duration: 0.8, delay: 0.2 }} className="h-full" style={{ background: SHAPE_COLORS[idx % 3] }} />
                    </div>
                    <span className="bauhaus-label text-[#121212]/40 w-8 text-[10px]">{r.percentage}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Commitment escalation ──────────────────────────────────── */}
        {formatQuizTime() && (
          <section className="pb-8 px-6">
            <div className="max-w-2xl mx-auto text-center">
              <p className="bauhaus-label text-[#121212]/40">
                You answered 8 questions in <span className="text-[#121212] font-bold">{formatQuizTime()}</span> -- your results are ready below
              </p>
            </div>
          </section>
        )}

        {/* ── Share Card ─────────────────────────────────────────────── */}
        <section className="pb-12 px-6">
          <div className="max-w-2xl mx-auto">
            <ShareCard archetype={primary.archetype} data={primary.data} />
            <div className="flex items-center justify-center gap-3 mt-6">
              <button onClick={handleCopy} className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-[#121212] shadow-hard-sm btn-press text-sm font-bold uppercase tracking-wider cursor-pointer">
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied!" : "Copy link"}
              </button>
              <a onClick={() => trackShareResult("twitter", primary.archetype)} href={`https://twitter.com/intent/tweet?text=I%27m%20The%20${primary.archetype}!%20Discover%20your%20core%20archetype%20%E2%86%92&url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener" className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-[#121212] shadow-hard-sm btn-press text-sm font-bold uppercase tracking-wider">
                <Twitter className="w-4 h-4" /> Twitter
              </a>
              <a onClick={() => trackShareResult("whatsapp", primary.archetype)} href={`https://wa.me/?text=I%27m%20The%20${primary.archetype}!%20Take%20the%20quiz%3A%20${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener" className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-[#121212] shadow-hard-sm btn-press text-sm font-bold uppercase tracking-wider">
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </a>
            </div>
          </div>
        </section>

        {/* ── LOCKED Sections (curiosity gap) ────────────────────────── */}
        <section className="pb-8 px-6">
          <div className="max-w-2xl mx-auto">
            <h3 className="bauhaus-label text-[#121212]/40 mb-6 text-center">Unlock your complete blueprint</h3>
            <div className="space-y-4">
              {lockedSections.map((section, idx) => (
                <div key={section.title} className="bauhaus-card p-8 relative overflow-hidden group">
                  {/* Geometric decoration */}
                  <div className="absolute top-3 right-3">
                    {idx % 3 === 0 && <div className="w-3 h-3 rounded-full bg-[#D02020]" />}
                    {idx % 3 === 1 && <div className="w-3 h-3 bg-[#1040C0]" />}
                    {idx % 3 === 2 && <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[10px] border-l-transparent border-r-transparent border-b-[#F0C020]" />}
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold tracking-tight uppercase">{section.title}</h3>
                    <span className="flex items-center gap-1.5 bauhaus-label text-[#121212]/40 bg-[#E0E0E0] border-2 border-[#121212] px-3 py-1">
                      <Lock className="w-3 h-3" /> UNLOCK
                    </span>
                  </div>
                  <p className="text-sm text-[#121212]/50 leading-relaxed font-medium">
                    <span className="text-[#121212]/60 font-bold">{section.teaser.slice(0, 55)}</span>
                    <span className="blur-[6px] group-hover:blur-[2px] transition-all duration-500 select-none">{section.preview}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Loss Aversion Banner ───────────────────────────────────── */}
        <section className="pb-4 px-6">
          <div className="max-w-2xl mx-auto">
            <div className="bg-[#F0C020] border-2 border-[#121212] shadow-hard-sm px-5 py-3 flex items-center justify-center gap-3 text-sm">
              <Clock className="w-4 h-4 text-[#121212] shrink-0" />
              <p className="text-[#121212] font-bold">
                Your analysis is stored for <span className="underline">24 hours</span>. After that, you&apos;d need to retake the quiz.
              </p>
            </div>
          </div>
        </section>

        {/* ── Bundle Unlock OR Paywall ───────────────────────────────── */}
        {bundleSessionId ? (
          // User came from a paid hexaco "dual" bundle. Skip Stripe; reveal report directly.
          <section className="py-12 px-6">
            <div className="max-w-2xl mx-auto">
              <div className="bauhaus-card p-10 text-center border-[#1040C0] bg-[#1040C0]/5">
                <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 bg-[#1040C0] text-white bauhaus-label font-bold border-2 border-[#121212]">
                  <Sparkles className="w-3.5 h-3.5" />
                  Bundle Unlocked
                </div>
                <h2 className="font-black text-2xl sm:text-3xl uppercase tracking-tighter mb-3">Your Full Blueprint Awaits</h2>
                <p className="text-[#121212]/60 mb-8 font-medium">
                  Your HEXACO + Archetype bundle is active. No further payment needed.
                </p>
                <Link
                  href={`/report?archetypes=${result?.primary.archetype || ""},${result?.secondary.archetype || ""}&tier=full&bundle=${bundleSessionId}`}
                  className="btn-bauhaus-red btn-press inline-flex items-center gap-2 font-bold px-10 py-4 text-lg cursor-pointer"
                >
                  Reveal Full Report
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </section>
        ) : (
          <section className="py-12 px-6">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <p className="text-[#121212]/40 text-sm line-through mb-1 font-medium">{pricing?.anchor ?? " "}</p>
                <h2 className="font-black text-2xl sm:text-3xl uppercase tracking-tighter">Unlock Your Full Blueprint</h2>
              </div>

              {/* 2 tiers */}
              <div className="grid sm:grid-cols-2 gap-4 mb-8 max-w-2xl mx-auto">
                {/* Basic */}
                <button
                  onClick={() => setSelectedTier("basic")}
                  className={`bauhaus-card p-8 text-left transition-all cursor-pointer ${selectedTier === "basic" ? "border-[#1040C0] bg-[#1040C0]/5" : ""}`}
                >
                  <h4 className="font-bold uppercase tracking-tight mb-1">Basic Report</h4>
                  <p className="text-2xl font-black mb-2">{pricing?.tiers.basic.display ?? "—"}</p>
                  <ul className="space-y-1.5 text-xs text-[#121212]/50 font-medium">
                    <li>+ Full text analysis</li>
                    <li>+ All 5 locked sections</li>
                    <li className="text-[#121212]/25">- Audio narration</li>
                    <li className="text-[#121212]/25">- PDF download</li>
                  </ul>
                </button>

                {/* Full -- recommended */}
                <button
                  onClick={() => setSelectedTier("full")}
                  className={`bauhaus-card p-8 text-left transition-all relative cursor-pointer ${selectedTier === "full" ? "border-[#D02020] bg-[#D02020]/5 shadow-[8px_8px_0px_0px_#D02020]" : ""}`}
                >
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#D02020] text-white bauhaus-label font-bold px-3 py-1 border-2 border-[#121212]">
                    Most Popular
                  </div>
                  <h4 className="font-bold uppercase tracking-tight mb-1">Full Blueprint</h4>
                  <p className="text-2xl font-black text-[#D02020] mb-2">{pricing?.tiers.full.display ?? "—"}</p>
                  <ul className="space-y-1.5 text-xs text-[#121212]/60 font-medium">
                    <li>+ Full text analysis</li>
                    <li>+ All 5 locked sections</li>
                    <li>+ Audio narration</li>
                    <li>+ PDF download</li>
                  </ul>
                </button>
              </div>

              {/* Checkout button */}
              <div className="text-center">
                <button
                  onClick={() => handleCheckout(selectedTier)}
                  className="btn-bauhaus-red btn-press inline-flex items-center gap-2 font-bold px-10 py-4 text-lg cursor-pointer"
                >
                  Unlock {selectedTier === "basic" ? "Basic Report" : "Full Blueprint"} -- {pricing?.tiers[selectedTier].display ?? "—"}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Section divider */}
        <div className="section-divider" />

        {/* HEXACO CTA */}
        <section className="py-20 px-6 bg-[#1040C0]">
          <div className="max-w-2xl mx-auto">
            <div className="bauhaus-card p-10 text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-[#D02020]" />
                <div className="w-3 h-3 bg-[#1040C0]" />
                <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[10px] border-l-transparent border-r-transparent border-b-[#F0C020]" />
              </div>
              <h3 className="font-black text-xl uppercase tracking-tighter mb-4">Ready for Scientific Precision?</h3>
              <p className="text-[#121212]/50 mb-6 font-medium">
                Your {primary.archetype} archetype is just the beginning. Get your complete creative personality mapped with 60 research-backed questions.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 text-xs">
                {[
                  { title: "24 Trait Breakdown", desc: "Facet-level analysis of creative style" },
                  { title: "Performance Insights", desc: "Stage presence & collaboration style" },
                  { title: "Character Arc Engine", desc: "Your artistic hero's journey mapped" },
                ].map((feat, i) => (
                  <div key={feat.title} className="p-3 border-2 border-[#121212] bg-[#F0F0F0] relative">
                    <div className="absolute top-2 right-2">
                      {i === 0 && <div className="w-2 h-2 rounded-full bg-[#D02020]" />}
                      {i === 1 && <div className="w-2 h-2 bg-[#1040C0]" />}
                      {i === 2 && <div className="w-0 h-0 border-l-[4px] border-r-[4px] border-b-[7px] border-l-transparent border-r-transparent border-b-[#F0C020]" />}
                    </div>
                    <div className="font-bold uppercase tracking-widest text-[10px] mb-1">{feat.title}</div>
                    <div className="text-[#121212]/40 font-medium">{feat.desc}</div>
                  </div>
                ))}
              </div>
              <a onClick={() => trackCtaClick("results_hexaco", "hexaco-test-app")} href="https://hexaco.raul.my?from=archetype" target="_blank" rel="noopener" className="btn-bauhaus-blue btn-press inline-flex items-center gap-2 font-bold px-6 py-3 text-sm">
                Unlock Your Complete Creative Identity <ArrowRight className="w-4 h-4" />
              </a>
              <p className="mt-6 text-xs font-medium text-white/70">
                Want this read in person?{" "}
                <a href="https://book.raul.my" target="_blank" rel="noopener" className="font-bold text-white underline underline-offset-4 hover:text-[#F0C020] transition-colors">
                  Work with Raul &rarr;
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t-4 border-[#121212] py-8 px-6 bg-white">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <span className="font-bold uppercase tracking-tighter text-sm">The Archetype Protocol</span>
            <span className="bauhaus-label text-[#121212]/40">&copy; 2026</span>
          </div>
        </footer>
      </motion.div>
    </div>
  );
}

// ── Share Card ─────────────────────────────────────────────────────────
function ShareCard({ archetype, data }: { archetype: Archetype; data: typeof ARCHETYPE_DATA[Archetype] }) {
  return (
    <div className="bauhaus-card p-10 text-center relative overflow-hidden bg-[#F0C020]/10">
      <p className="bauhaus-label text-[#121212]/50 mb-4">My Core Archetype</p>
      <h2 className="font-black text-4xl uppercase tracking-tighter mb-2 text-[#D02020]">
        {data.emoji} The {archetype}
      </h2>
      <p className="text-[#121212]/50 text-sm mb-6 max-w-md mx-auto font-medium">{data.tagline}</p>
      <div className="flex items-center justify-center gap-2 bauhaus-label text-[#121212]/40">
        <span>thearchetypeprotocol.com</span>
        <span>&middot;</span>
        <span>What&apos;s yours?</span>
      </div>
    </div>
  );
}

// ── Page wrapper with Suspense ────────────────────────────────────────
export default function ResultsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F0F0F0] flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-[#121212]/30" /></div>}>
      <ResultsContent />
    </Suspense>
  );
}
