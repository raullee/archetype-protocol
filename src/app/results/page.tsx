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

const ICON_MAP: Record<string, React.ElementType> = {
  Crown, Palette, Heart, Sun, BookOpen, Compass, Zap, Sparkles, Shield, HeartHandshake, Laugh, Users,
};

// ── Social proof ticker data ──────────────────────────────────────────
const SOCIAL_PROOF_NAMES = [
  { name: "Emma", city: "Melbourne", archetype: "Creator" },
  { name: "James", city: "London", archetype: "Sage" },
  { name: "Sarah", city: "Toronto", archetype: "Explorer" },
  { name: "Marcus", city: "Berlin", archetype: "Outlaw" },
  { name: "Priya", city: "Singapore", archetype: "Ruler" },
  { name: "Liam", city: "Dublin", archetype: "Hero" },
  { name: "Yuki", city: "Tokyo", archetype: "Magician" },
  { name: "Sofia", city: "Barcelona", archetype: "Lover" },
  { name: "Alex", city: "New York", archetype: "Jester" },
  { name: "Fatima", city: "Dubai", archetype: "Caregiver" },
  { name: "Oliver", city: "Sydney", archetype: "Everyman" },
  { name: "Nina", city: "Stockholm", archetype: "Innocent" },
  { name: "Carlos", city: "São Paulo", archetype: "Hero" },
  { name: "Hannah", city: "Amsterdam", archetype: "Creator" },
  { name: "Raj", city: "Mumbai", archetype: "Sage" },
];

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
      preview: `Every ${a} carries a shadow that emerges under pressure. Your shadow manifests as the opposite of your greatest strength — the very quality others admire in you becomes weaponized. When triggered, you shift into a pattern of behavior that feels completely justified but is actually...`,
    },
    {
      title: "Personal Growth Roadmap",
      teaser: `The single habit that would transform your ${a} energy into...`,
      preview: `Phase 1 (Weeks 1-4): Recognize the core pattern — your tendency to default to your ${a} strength even when the situation calls for something different. The specific daily practice that unlocks growth for ${a}s involves a 5-minute exercise that rewires your instinctive response to...`,
    },
    {
      title: "Decision-Making Style", 
      teaser: `You make 73% of your decisions using a pattern that...`,
      preview: `${a}s process decisions through a distinctive framework that prioritizes ${a === "Sage" ? "logical analysis" : a === "Ruler" ? "control and outcome certainty" : a === "Caregiver" ? "impact on others" : a === "Explorer" ? "novelty and freedom" : a === "Creator" ? "aesthetic and originality" : a === "Hero" ? "moral alignment" : "instinct"} over competing factors. This creates a blind spot in situations requiring rapid emotional assessment. Your decision accuracy drops by an estimated 40% when...`,
    },
    {
      title: "✨ Character Arc Engine",
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
    personality: "You operate with a rare combination of strategic vision and commanding presence. People naturally look to you for direction, not because you demand it, but because you radiate competence and clarity. Your mind instinctively organizes chaos into systems — you don't just lead, you architect outcomes.",
    topStrength: "Strategic command — you see the endgame when others are still figuring out the rules. Your ability to organize people and resources toward a vision makes you indispensable in any high-stakes environment.",
    blindSpot: "You struggle to relinquish control even when delegation would produce better results. Your need for authority can create invisible walls between you and the honest feedback you desperately need.",
  },
  Creator: {
    personality: "Your mind doesn't follow paths — it builds them. You experience the world as raw material waiting to be shaped, and you feel most alive in the act of making something new. Routine is your kryptonite; novelty is your oxygen.",
    topStrength: "Original vision — you see possibilities in blank spaces that others walk right past. Your ability to synthesize disparate ideas into something wholly new is genuinely rare and commercially valuable.",
    blindSpot: "Perfectionism masquerades as high standards, but it's actually fear. You abandon more brilliant ideas halfway through than most people ever have, because the gap between your vision and execution feels unbearable.",
  },
  Caregiver: {
    personality: "You possess an almost supernatural ability to sense what others need before they ask. Your empathy isn't just emotional — it's strategic. You read rooms, anticipate problems, and quietly ensure everyone around you is supported.",
    topStrength: "Emotional intelligence — you build trust faster than anyone in the room. People confide in you, follow you, and remain loyal to you because they feel genuinely seen in your presence.",
    blindSpot: "You give until you're empty, then resent the people you chose to serve. Your boundaries are porous, and you interpret setting limits as selfishness — which is exactly the belief that leads to your burnout cycles.",
  },
  Innocent: {
    personality: "Your authenticity is disarming in a world of performance. You carry a genuine belief in human goodness that others find both refreshing and magnetic. Where cynics see problems, you see possibilities — and you're right more often than they'd like to admit.",
    topStrength: "Radical authenticity — you create psychological safety simply by being present. People lower their defenses around you because your optimism is contagious and your sincerity is unmistakable.",
    blindSpot: "You avoid necessary conflict until it becomes unavoidable crisis. Your desire to maintain harmony means you sometimes tolerate situations that are genuinely harmful to you, mistaking endurance for grace.",
  },
  Sage: {
    personality: "You process the world through understanding. Where others react, you analyze. Where others assume, you investigate. Your need for truth isn't academic — it's existential. Knowledge is how you make the world feel safe and navigable.",
    topStrength: "Deep analytical clarity — you cut through noise and complexity to find the signal. When everyone else is confused or panicking, you're the one who identifies the real problem and the real solution.",
    blindSpot: "You retreat into your head when life demands you be in your heart. Your tendency to intellectualize emotions creates a subtle disconnection in your closest relationships that you may not even notice until it's too late.",
  },
  Explorer: {
    personality: "Freedom isn't a preference for you — it's a biological imperative. You wither in environments that restrict your movement, choices, or growth. Your restlessness isn't a flaw; it's the engine that drives you toward discoveries others never make.",
    topStrength: "Adaptive courage — you thrive in uncertainty that paralyzes others. Your willingness to venture into the unknown, combined with your resourcefulness, means you accumulate experiences and skills at an extraordinary rate.",
    blindSpot: "You conflate commitment with captivity. The moment a relationship, job, or place starts feeling routine, an alarm goes off inside you — and you don't always stop to ask whether the alarm is wisdom or fear.",
  },
  Outlaw: {
    personality: "You see the invisible rules that govern everyone else's behavior — and you refuse to follow them blindly. Your rebelliousness isn't random; it's targeted at systems you perceive as unjust, outdated, or dishonest. You'd rather be disliked for truth than loved for compliance.",
    topStrength: "Fearless truth-telling — you say what everyone else is thinking but won't voice. In organizations and relationships, you're the one who names the elephant in the room, which makes you invaluable to anyone brave enough to listen.",
    blindSpot: "You can become so identified with being 'against' things that you forget to build something worth being 'for.' Your oppositional energy, unchecked, destroys alliances you actually need to create the change you want.",
  },
  Magician: {
    personality: "You operate on a different plane of awareness than most people. You intuitively understand how to shift energy, reframe perspectives, and catalyze transformation in others. People leave conversations with you seeing the world differently — and they can't always explain why.",
    topStrength: "Transformative influence — you have a rare ability to help people see beyond their current limitations. Your vision and charisma combine to make the impossible feel not just possible, but inevitable.",
    blindSpot: "Your gift for influence has a dark edge: you can manipulate without realizing it. When your vision becomes more important than others' autonomy, your charisma becomes a tool of control rather than liberation.",
  },
  Hero: {
    personality: "You were built for adversity. Where others see obstacles, you see proving grounds. Your identity is forged in the fires of challenge, and you derive deep meaning from overcoming what others consider impossible. Quitting isn't in your vocabulary.",
    topStrength: "Indomitable resilience — you don't just endure hardship, you transmute it into strength. Your ability to keep moving forward inspires everyone watching, and your grit has a compounding effect that others consistently underestimate.",
    blindSpot: "You need enemies to feel alive. Without a battle to fight, you create one — in your relationships, your career, even within yourself. Rest feels like surrender, and you don't realize that your inability to be at peace is itself the dragon you need to slay.",
  },
  Lover: {
    personality: "You experience life at full emotional voltage. Beauty, connection, and passion aren't luxuries for you — they're necessities. You form bonds of extraordinary depth and bring an intensity of feeling that transforms every relationship you enter.",
    topStrength: "Emotional depth — you create connections that others describe as life-changing. Your capacity for intimacy, vulnerability, and passionate commitment makes you an irreplaceable presence in the lives of those you love.",
    blindSpot: "You lose yourself in others. Your identity becomes entangled with your relationships to the point where you can't distinguish your own needs from your partner's. When love ends, you don't just lose a person — you lose your sense of self.",
  },
  Jester: {
    personality: "You understand something most people miss: life is absurd, and the healthiest response to absurdity is laughter. Your humor isn't superficial — it's a form of wisdom. You disarm tension, reveal hypocrisy, and create joy in spaces that desperately need it.",
    topStrength: "Social alchemy — you transform the energy of any room you enter. Your ability to make people laugh creates psychological safety, breaks down barriers, and makes you someone people actively seek out during their hardest moments.",
    blindSpot: "Your humor is also your armor. You use laughter to avoid pain, deflect vulnerability, and maintain distance from emotions that feel too heavy to carry. The people closest to you sense there's a deeper you that you won't let them reach.",
  },
  Everyman: {
    personality: "Your superpower is the one most overlooked: genuine relatability. You meet people exactly where they are, without pretension or agenda. In a world obsessed with standing out, your ability to make others feel they belong is quietly revolutionary.",
    topStrength: "Universal connection — you build bridges between people who would otherwise never understand each other. Your groundedness and authenticity create a gravity that holds groups together through conflict and change.",
    blindSpot: "You've become so skilled at fitting in that you've forgotten what it feels like to stand out. Your fear of seeming 'too much' keeps you playing small, and the world is missing the full version of you that you've been too cautious to reveal.",
  },
};

// ── Session timer hook ────────────────────────────────────────────────
function useSessionTimer() {
  const [remaining, setRemaining] = useState<string>("");
  const [expiresAt] = useState(() => {
    if (typeof window === "undefined") return Date.now() + 24 * 60 * 60 * 1000;
    const stored = localStorage.getItem("ap_session_expires");
    if (stored) return parseInt(stored, 10);
    const exp = Date.now() + 24 * 60 * 60 * 1000;
    localStorage.setItem("ap_session_expires", exp.toString());
    return exp;
  });

  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, expiresAt - Date.now());
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setRemaining(`${h}h ${m.toString().padStart(2, "0")}m ${s.toString().padStart(2, "0")}s`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [expiresAt]);

  return remaining;
}

// ── Social proof ticker component ─────────────────────────────────────
function SocialProofTicker() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % SOCIAL_PROOF_NAMES.length);
    }, 17000); // rotate every 17s
    return () => clearInterval(id);
  }, []);

  const person = SOCIAL_PROOF_NAMES[index];

  return (
    <div className="fixed bottom-6 left-6 z-40">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="glass-card rounded-xl px-4 py-3 flex items-center gap-3 max-w-xs"
        >
          <div className="w-8 h-8 rounded-full bg-[#6366F1]/20 flex items-center justify-center text-xs font-medium text-[#6366F1]">
            {person.name[0]}
          </div>
          <div>
            <p className="text-xs text-zinc-300">
              <span className="font-medium text-[#F5F5F7]">{person.name}</span> from {person.city}
            </p>
            <p className="text-xs text-zinc-500">just discovered they&apos;re The {person.archetype}</p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

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
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1"
          />
        ))}
        {/* Axis lines */}
        {pointsOuter.map((p, i) => (
          <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        ))}
        {/* Data polygon */}
        <motion.polygon
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          points={pointsData.map((p) => `${p.x},${p.y}`).join(" ")}
          fill="rgba(99,102,241,0.15)"
          stroke="#6366F1"
          strokeWidth="2"
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />
        {/* Data points */}
        {pointsData.map((p, i) => (
          <motion.circle
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 + i * 0.05 }}
            cx={p.x} cy={p.y} r="4"
            fill={ARCHETYPE_DATA[topScores[i].archetype].accentColor}
            stroke="#0A0A0B" strokeWidth="2"
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
              className="fill-zinc-500 text-[10px]"
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
  const [selectedTier, setSelectedTier] = useState<"basic" | "full" | "couples">("full");
  const sessionTimer = useSessionTimer();

  const answersParam = searchParams.get("a") || searchParams.get("archetypes") || "";
  const answers = answersParam.split(",").filter(Boolean) as Archetype[];
  const quizSeconds = parseInt(searchParams.get("t") || "0", 10);

  const result = answers.length > 0 ? getTopArchetypes(answers) : null;

  useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleCheckout = useCallback((tier: string) => {
    const priceMap: Record<string, number> = { basic: 999, full: 1999, couples: 3499 };
    const nameMap: Record<string, string> = {
      basic: "Basic Archetype Report",
      full: "Full Archetype Blueprint (Text + Audio + PDF)",
      couples: "Couples Bundle — 2 Reports + Compatibility Analysis",
    };
    fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        archetypes: result ? [result.primary.archetype, result.secondary.archetype] : [],
        tier,
        price: priceMap[tier],
        productName: nameMap[tier],
      }),
    })
      .then((r) => r.json())
      .then((data) => { if (data.url) window.location.href = data.url; })
      .catch(console.error);
  }, [result]);

  if (!result) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-500 mb-4">No results found.</p>
          <Link href="/test" className="text-[#6366F1] hover:underline">Take the quiz →</Link>
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
    setTimeout(() => setCopied(false), 2000);
  };

  const formatQuizTime = () => {
    if (!quizSeconds) return null;
    const m = Math.floor(quizSeconds / 60);
    const s = quizSeconds % 60;
    return `${m}m ${s.toString().padStart(2, "0")}s`;
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B]">
      {/* Social proof ticker */}
      <SocialProofTicker />

      {/* The Reveal */}
      <AnimatePresence>
        {!revealed && (
          <motion.div exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-[#0A0A0B] flex items-center justify-center">
            <motion.div className="text-center">
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
                className="mb-6"
              >
                <PrimaryIcon className="w-16 h-16 mx-auto" style={{ color: primary.data.accentColor }} />
              </motion.div>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="text-zinc-500 text-sm uppercase tracking-[0.3em] mb-4">
                You are
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3, duration: 0.8 }}
                className="font-serif text-5xl sm:text-7xl font-bold"
                style={{ textShadow: `0 0 60px ${primary.data.accentColor}40` }}
              >
                The {primary.archetype}
              </motion.h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }} className="text-zinc-400 mt-4 text-lg">
                {primary.data.tagline}
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: revealed ? 1 : 0 }} transition={{ duration: 0.8 }}>
        {/* Session timer bar */}
        <div className="fixed top-0 left-0 right-0 z-40 bg-[#0A0A0B]/90 backdrop-blur-sm border-b border-white/[0.06]">
          <div className="max-w-3xl mx-auto px-6 py-2 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-zinc-500">
              <Clock className="w-3 h-3" />
              <span>Analysis expires in <span className="text-[#F59E0B] font-medium">{sessionTimer}</span></span>
            </div>
            {formatQuizTime() && (
              <div className="flex items-center gap-2 text-zinc-600">
                <Timer className="w-3 h-3" />
                <span>Completed in {formatQuizTime()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Header */}
        <div className="pt-24 pb-12 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/[0.03] border border-white/[0.06] rounded-full px-4 py-2 mb-8">
              <PrimaryIcon className="w-5 h-5" style={{ color: primary.data.accentColor }} />
              <span className="text-sm font-medium">Your Core Archetype</span>
            </div>
            <h1 className="font-serif text-5xl sm:text-6xl font-bold mb-4">The {primary.archetype}</h1>

            {/* Archetype badges */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <span className="px-4 py-2 rounded-lg text-sm font-medium border" style={{ borderColor: `${primary.data.accentColor}40`, color: primary.data.accentColor, background: `${primary.data.accentColor}10` }}>
                Primary: {primary.archetype}
              </span>
              {secondary.score > 0 && (
                <span className="px-4 py-2 rounded-lg text-sm font-medium border border-white/[0.1] text-zinc-400 bg-white/[0.03] flex items-center gap-2">
                  Secondary: {secondary.archetype}
                  <Lock className="w-3 h-3 text-zinc-600" />
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── FREE: Personality Deep-Dive ─────────────────────────────── */}
        <section className="pb-12 px-6">
          <div className="max-w-2xl mx-auto glass-card rounded-2xl p-8">
            <h3 className="text-xs uppercase tracking-[0.2em] text-[#6366F1] font-medium mb-4">Your Personality Profile</h3>
            <p className="text-zinc-300 leading-relaxed text-[15px]">{insights.personality}</p>
          </div>
        </section>

        {/* ── FREE: #1 Strength & #1 Blind Spot ──────────────────────── */}
        <section className="pb-12 px-6">
          <div className="max-w-2xl mx-auto grid sm:grid-cols-2 gap-6">
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-[#22D3EE]/10 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[#22D3EE]" />
                </div>
                <h3 className="font-semibold text-[#22D3EE]">#1 Strength</h3>
              </div>
              <p className="text-sm text-zinc-300 leading-relaxed">{insights.topStrength}</p>
            </div>
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-[#F59E0B]/10 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-[#F59E0B]" />
                </div>
                <h3 className="font-semibold text-[#F59E0B]">#1 Blind Spot</h3>
              </div>
              <p className="text-sm text-zinc-300 leading-relaxed">{insights.blindSpot}</p>
            </div>
          </div>
        </section>

        {/* ── FREE: Radar Chart ──────────────────────────────────────── */}
        <section className="pb-12 px-6">
          <div className="max-w-2xl mx-auto glass-card rounded-2xl p-8">
            <h3 className="font-semibold text-lg mb-6 text-center">Your Archetype Spectrum</h3>
            <RadarChart scores={result.all} />
            {/* Bar fallback beneath */}
            <div className="mt-8 space-y-3">
              {result.all.slice(0, 6).filter((r: ArchetypeResult) => r.score > 0).map((r: ArchetypeResult) => {
                const data = ARCHETYPE_DATA[r.archetype];
                const maxScore = result.all[0].score;
                const width = (r.score / maxScore) * 100;
                return (
                  <div key={r.archetype} className="flex items-center gap-4">
                    <span className="text-xs text-zinc-500 w-20 text-right">{r.archetype}</span>
                    <div className="flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${width}%` }} transition={{ duration: 0.8, delay: 0.2 }} className="h-full rounded-full" style={{ background: data.accentColor }} />
                    </div>
                    <span className="text-xs text-zinc-600 w-6">{r.percentage}%</span>
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
              <p className="text-xs text-zinc-600">
                You answered 8 questions in <span className="text-zinc-400 font-medium">{formatQuizTime()}</span> — your results are ready below
              </p>
            </div>
          </section>
        )}

        {/* ── Share Card ─────────────────────────────────────────────── */}
        <section className="pb-12 px-6">
          <div className="max-w-2xl mx-auto">
            <ShareCard archetype={primary.archetype} data={primary.data} />
            <div className="flex items-center justify-center gap-3 mt-6">
              <button onClick={handleCopy} className="flex items-center gap-2 px-4 py-2 glass-card rounded-lg text-sm text-zinc-400 hover:text-white transition-colors cursor-pointer">
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied!" : "Copy link"}
              </button>
              <a href={`https://twitter.com/intent/tweet?text=I%27m%20The%20${primary.archetype}!%20Discover%20your%20core%20archetype%20%E2%86%92&url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener" className="flex items-center gap-2 px-4 py-2 glass-card rounded-lg text-sm text-zinc-400 hover:text-white transition-colors">
                <Twitter className="w-4 h-4" /> Twitter
              </a>
              <a href={`https://wa.me/?text=I%27m%20The%20${primary.archetype}!%20Take%20the%20quiz%3A%20${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener" className="flex items-center gap-2 px-4 py-2 glass-card rounded-lg text-sm text-zinc-400 hover:text-white transition-colors">
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </a>
            </div>
          </div>
        </section>

        {/* ── LOCKED Sections (curiosity gap) ────────────────────────── */}
        <section className="pb-8 px-6">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-xs uppercase tracking-[0.2em] text-zinc-600 font-medium mb-6 text-center">Unlock your complete blueprint</h3>
            <div className="space-y-4">
              {lockedSections.map((section) => (
                <div key={section.title} className="glass-card rounded-2xl p-6 relative overflow-hidden group">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">{section.title}</h3>
                    <span className="flex items-center gap-1.5 text-xs text-zinc-600 bg-white/[0.03] px-3 py-1 rounded-full">
                      <Lock className="w-3 h-3" /> LOCKED
                    </span>
                  </div>
                  {/* Curiosity gap: visible teaser before blur */}
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    <span className="text-zinc-300">{section.teaser.slice(0, 55)}</span>
                    <span className="blur-[6px] select-none">{section.preview}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Loss Aversion Banner ───────────────────────────────────── */}
        <section className="pb-4 px-6">
          <div className="max-w-2xl mx-auto">
            <div className="rounded-xl bg-[#F59E0B]/5 border border-[#F59E0B]/10 px-5 py-3 flex items-center justify-center gap-3 text-sm">
              <Clock className="w-4 h-4 text-[#F59E0B] shrink-0" />
              <p className="text-zinc-400">
                Your analysis is stored for <span className="text-[#F59E0B] font-medium">24 hours</span>. After that, you&apos;d need to retake the quiz.
              </p>
            </div>
          </div>
        </section>

        {/* ── Decoy Pricing / CTA ────────────────────────────────────── */}
        <section className="py-12 px-6">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <p className="text-zinc-600 text-sm line-through mb-1">$200/hr therapy session</p>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold">Unlock Your Full Archetype Blueprint</h2>
            </div>

            {/* 3 tiers */}
            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              {/* Basic */}
              <button
                onClick={() => setSelectedTier("basic")}
                className={`glass-card rounded-2xl p-6 text-left transition-all cursor-pointer ${selectedTier === "basic" ? "border-white/20 bg-white/[0.04]" : "border-white/[0.06] hover:border-white/10"} border`}
              >
                <h4 className="font-semibold mb-1">Basic Report</h4>
                <p className="text-2xl font-bold mb-2">$9.99</p>
                <ul className="space-y-1.5 text-xs text-zinc-500">
                  <li>✓ Full text analysis</li>
                  <li>✓ All 5 locked sections</li>
                  <li className="text-zinc-700">✗ Audio narration</li>
                  <li className="text-zinc-700">✗ PDF download</li>
                  <li className="text-zinc-700">✗ Compatibility analysis</li>
                </ul>
              </button>

              {/* Full — recommended */}
              <button
                onClick={() => setSelectedTier("full")}
                className={`rounded-2xl p-6 text-left transition-all relative cursor-pointer ${selectedTier === "full" ? "border-[#6366F1]/50 bg-[#6366F1]/5 glow-indigo" : "border-[#6366F1]/20 hover:border-[#6366F1]/30 bg-[#6366F1]/[0.03]"} border`}
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#6366F1] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                  Most Popular
                </div>
                <h4 className="font-semibold mb-1">Full Blueprint</h4>
                <p className="text-2xl font-bold text-[#6366F1] mb-2">$19.99</p>
                <ul className="space-y-1.5 text-xs text-zinc-400">
                  <li>✓ Full text analysis</li>
                  <li>✓ All 5 locked sections</li>
                  <li>✓ Audio narration</li>
                  <li>✓ PDF download</li>
                  <li className="text-zinc-700">✗ Compatibility analysis</li>
                </ul>
              </button>

              {/* Couples */}
              <button
                onClick={() => setSelectedTier("couples")}
                className={`glass-card rounded-2xl p-6 text-left transition-all cursor-pointer ${selectedTier === "couples" ? "border-white/20 bg-white/[0.04]" : "border-white/[0.06] hover:border-white/10"} border`}
              >
                <h4 className="font-semibold mb-1">Couples Bundle</h4>
                <p className="text-2xl font-bold mb-2">$34.99</p>
                <ul className="space-y-1.5 text-xs text-zinc-400">
                  <li>✓ 2 full reports</li>
                  <li>✓ All 5 locked sections</li>
                  <li>✓ Audio narration</li>
                  <li>✓ PDF download</li>
                  <li>✓ Compatibility analysis</li>
                </ul>
              </button>
            </div>

            {/* Checkout button */}
            <motion.div
              animate={{ boxShadow: ["0 0 20px rgba(99,102,241,0.1)", "0 0 40px rgba(99,102,241,0.2)", "0 0 20px rgba(99,102,241,0.1)"] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-center"
            >
              <button
                onClick={() => handleCheckout(selectedTier)}
                className="inline-flex items-center gap-2 bg-[#6366F1] hover:bg-[#5558E6] text-white font-medium px-10 py-4 rounded-xl text-lg transition-all hover:shadow-[0_0_40px_rgba(99,102,241,0.3)] cursor-pointer"
              >
                Unlock {selectedTier === "basic" ? "Basic Report" : selectedTier === "full" ? "Full Blueprint" : "Couples Bundle"} — ${selectedTier === "basic" ? "9.99" : selectedTier === "full" ? "19.99" : "34.99"}
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          </div>
        </section>

        {/* HEXACO CTA - Enhanced */}
        <section className="pb-20 px-6">
          <div className="max-w-2xl mx-auto">
            <div className="glass-card rounded-2xl p-8 text-center border-[#22D3EE]/20">
              <h3 className="font-serif text-xl font-bold mb-4">Ready for Scientific Precision?</h3>
              <p className="text-zinc-400 mb-6">
                Your {primary.archetype} archetype is just the beginning. Get your complete creative personality mapped with 60 research-backed questions.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 text-xs">
                <div className="p-3 bg-white/5 rounded-lg">
                  <div className="text-[#22D3EE] font-medium mb-1">24 Trait Breakdown</div>
                  <div className="text-zinc-600">Facet-level analysis of creative style</div>
                </div>
                <div className="p-3 bg-white/5 rounded-lg">
                  <div className="text-[#22D3EE] font-medium mb-1">Performance Insights</div>
                  <div className="text-zinc-600">Stage presence & collaboration style</div>
                </div>
                <div className="p-3 bg-white/5 rounded-lg">
                  <div className="text-[#22D3EE] font-medium mb-1">Character Arc Engine</div>
                  <div className="text-zinc-600">Your artistic hero's journey mapped</div>
                </div>
              </div>
              <a href="https://hexaco-test-app.vercel.app?from=archetype" target="_blank" rel="noopener" className="inline-flex items-center gap-2 bg-[#22D3EE] hover:bg-[#06B6D4] text-black font-medium px-6 py-3 rounded-xl transition-colors">
                Unlock Your Complete Creative Identity <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/[0.06] py-8 px-6">
          <div className="max-w-6xl mx-auto flex items-center justify-between text-xs text-zinc-600">
            <span className="font-serif">The Archetype Protocol</span>
            <span>© 2026</span>
          </div>
        </footer>
      </motion.div>
    </div>
  );
}

// ── Share Card ─────────────────────────────────────────────────────────
function ShareCard({ archetype, data }: { archetype: Archetype; data: typeof ARCHETYPE_DATA[Archetype] }) {
  return (
    <div className="rounded-2xl p-8 text-center relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${data.accentColor}15, ${data.accentColor}05)`, border: `1px solid ${data.accentColor}30` }}>
      <p className="text-xs uppercase tracking-[0.3em] text-zinc-500 mb-4">My Core Archetype</p>
      <h2 className="font-serif text-4xl font-bold mb-2" style={{ color: data.accentColor }}>
        {data.emoji} The {archetype}
      </h2>
      <p className="text-zinc-400 text-sm mb-6 max-w-md mx-auto">{data.tagline}</p>
      <div className="flex items-center justify-center gap-2 text-xs text-zinc-600">
        <span>thearchetypeprotocol.com</span>
        <span>·</span>
        <span>What&apos;s yours? →</span>
      </div>
    </div>
  );
}

// ── Page wrapper with Suspense ────────────────────────────────────────
export default function ResultsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-zinc-600" /></div>}>
      <ResultsContent />
    </Suspense>
  );
}
