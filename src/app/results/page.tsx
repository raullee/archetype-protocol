"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Archetype, ARCHETYPE_DATA } from "@/lib/archetypes";
import { getTopArchetypes, ArchetypeResult } from "@/utils/calculateArchetype";
import { Lock, Share2, Twitter, MessageCircle, Download, ArrowRight, Copy, Check, Crown, Palette, Heart, Sun, BookOpen, Compass, Zap, Sparkles, Shield, HeartHandshake, Laugh, Users, Loader2 } from "lucide-react";
import Link from "next/link";

const ICON_MAP: Record<string, React.ElementType> = {
  Crown, Palette, Heart, Sun, BookOpen, Compass, Zap, Sparkles, Shield, HeartHandshake, Laugh, Users,
};

function ResultsContent() {
  const searchParams = useSearchParams();
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  const answersParam = searchParams.get("a") || searchParams.get("archetypes") || "";
  const answers = answersParam.split(",").filter(Boolean) as Archetype[];

  const result = answers.length > 0 ? getTopArchetypes(answers) : null;

  useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), 3000);
    return () => clearTimeout(timer);
  }, []);

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
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const topScores = result.all.slice(0, 6).filter((r: ArchetypeResult) => r.score > 0);

  return (
    <div className="min-h-screen bg-[#0A0A0B]">
      {/* The Reveal */}
      <AnimatePresence>
        {!revealed && (
          <motion.div
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#0A0A0B] flex items-center justify-center"
          >
            <motion.div className="text-center">
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="mb-6"
              >
                <PrimaryIcon className="w-16 h-16 mx-auto" style={{ color: primary.data.accentColor }} />
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-zinc-500 text-sm uppercase tracking-[0.3em] mb-4"
              >
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
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                className="text-zinc-400 mt-4 text-lg"
              >
                {primary.data.tagline}
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: revealed ? 1 : 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Header */}
        <div className="pt-20 pb-16 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/[0.03] border border-white/[0.06] rounded-full px-4 py-2 mb-8">
              <PrimaryIcon className="w-5 h-5" style={{ color: primary.data.accentColor }} />
              <span className="text-sm font-medium">Your Core Archetype</span>
            </div>
            <h1 className="font-serif text-5xl sm:text-6xl font-bold mb-4">The {primary.archetype}</h1>
            <p className="text-zinc-400 text-lg max-w-xl mx-auto mb-6">{primary.data.description}</p>
            
            {/* Archetype badges */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <span className="px-4 py-2 rounded-lg text-sm font-medium border" style={{ borderColor: `${primary.data.accentColor}40`, color: primary.data.accentColor, background: `${primary.data.accentColor}10` }}>
                Primary: {primary.archetype}
              </span>
              {secondary.score > 0 && (
                <span className="px-4 py-2 rounded-lg text-sm font-medium border border-white/[0.1] text-zinc-400 bg-white/[0.03]">
                  Secondary: {secondary.archetype}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Score Visualization */}
        <section className="pb-16 px-6">
          <div className="max-w-2xl mx-auto glass-card rounded-2xl p-8">
            <h3 className="font-semibold text-lg mb-6">Your Archetype Profile</h3>
            <div className="space-y-4">
              {topScores.map((r: ArchetypeResult) => {
                const data = ARCHETYPE_DATA[r.archetype];
                const maxScore = topScores[0].score;
                const width = (r.score / maxScore) * 100;
                return (
                  <div key={r.archetype} className="flex items-center gap-4">
                    <span className="text-sm text-zinc-400 w-24 text-right">{r.archetype}</span>
                    <div className="flex-1 h-2 bg-white/[0.06] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${width}%` }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="h-full rounded-full"
                        style={{ background: data.accentColor }}
                      />
                    </div>
                    <span className="text-sm text-zinc-600 w-8">{r.score}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Free: Strengths & Challenges */}
        <section className="pb-16 px-6">
          <div className="max-w-2xl mx-auto grid sm:grid-cols-2 gap-6">
            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-semibold mb-4 text-[#22D3EE]">Your Strengths</h3>
              <ul className="space-y-3">
                {primary.data.strengths.map((s: string) => (
                  <li key={s} className="text-sm text-zinc-300 flex items-start gap-2">
                    <span className="text-[#22D3EE] mt-0.5">✦</span> {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-semibold mb-4 text-[#F59E0B]">Your Challenges</h3>
              <ul className="space-y-3">
                {primary.data.challenges.map((c: string) => (
                  <li key={c} className="text-sm text-zinc-300 flex items-start gap-2">
                    <span className="text-[#F59E0B] mt-0.5">⚡</span> {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Share Card */}
        <section className="pb-16 px-6">
          <div className="max-w-2xl mx-auto">
            <ShareCard archetype={primary.archetype} data={primary.data} />
            <div className="flex items-center justify-center gap-3 mt-6">
              <button onClick={handleCopy} className="flex items-center gap-2 px-4 py-2 glass-card rounded-lg text-sm text-zinc-400 hover:text-white transition-colors">
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied!" : "Copy link"}
              </button>
              <a href={`https://twitter.com/intent/tweet?text=I'm The ${primary.archetype}! Discover your core archetype →&url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener" className="flex items-center gap-2 px-4 py-2 glass-card rounded-lg text-sm text-zinc-400 hover:text-white transition-colors">
                <Twitter className="w-4 h-4" /> Twitter
              </a>
              <a href={`https://wa.me/?text=I'm The ${primary.archetype}! Take the quiz: ${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener" className="flex items-center gap-2 px-4 py-2 glass-card rounded-lg text-sm text-zinc-400 hover:text-white transition-colors">
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </a>
            </div>
          </div>
        </section>

        {/* Locked Sections */}
        <section className="pb-8 px-6">
          <div className="max-w-2xl mx-auto space-y-4">
            {[
              { title: "Your Relationship Blind Spot", preview: "Your tendency to prioritize logic over emotional attunement means partners often feel unheard. The key shift involves..." },
              { title: "Career Alignment Analysis", preview: "Your archetype thrives in roles requiring strategic vision and autonomous decision-making. Top-fit industries include..." },
              { title: "Your Shadow Archetype", preview: "Under stress, your Sage shadow emerges as intellectual superiority — dismissing others' feelings as irrational..." },
              { title: "Personal Growth Roadmap", preview: "Phase 1: Recognize the pattern of retreating into analysis when emotions arise. Start with daily 5-minute..." },
              { title: "Decision-Making Style", preview: "You process decisions through a framework of logical analysis first, consulting intuition only when data is..." },
            ].map((section) => (
              <div key={section.title} className="glass-card rounded-2xl p-6 relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">{section.title}</h3>
                  <span className="flex items-center gap-1.5 text-xs text-zinc-600 bg-white/[0.03] px-3 py-1 rounded-full">
                    <Lock className="w-3 h-3" /> LOCKED
                  </span>
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed blur-[6px] select-none">
                  {section.preview}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Floating CTA */}
        <section className="py-12 px-6">
          <div className="max-w-2xl mx-auto">
            <motion.div
              animate={{ boxShadow: ["0 0 20px rgba(99,102,241,0.1)", "0 0 40px rgba(99,102,241,0.2)", "0 0 20px rgba(99,102,241,0.1)"] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="bg-gradient-to-r from-[#6366F1]/10 to-[#22D3EE]/10 border border-[#6366F1]/20 rounded-2xl p-8 text-center"
            >
              <p className="text-zinc-500 text-sm mb-2 line-through">$200/hr therapy session</p>
              <h3 className="font-serif text-2xl font-bold mb-2">Unlock Your Full Archetype Blueprint</h3>
              <p className="text-3xl font-bold text-[#6366F1] mb-1">$19.99 <span className="text-sm text-zinc-500 font-normal">one-time</span></p>
              <p className="text-zinc-600 text-xs mb-6">Career alignment · Relationship insights · Shadow work · Growth roadmap</p>
              <button
                onClick={() => {
                  fetch("/api/checkout", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ archetypes: [primary.archetype, secondary.archetype] }),
                  })
                    .then((r) => r.json())
                    .then((data) => { if (data.url) window.location.href = data.url; })
                    .catch(console.error);
                }}
                className="inline-flex items-center gap-2 bg-[#6366F1] hover:bg-[#5558E6] text-white font-medium px-8 py-4 rounded-xl text-lg transition-all hover:shadow-[0_0_40px_rgba(99,102,241,0.3)] cursor-pointer"
              >
                Unlock Full Report <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          </div>
        </section>

        {/* HEXACO CTA */}
        <section className="pb-20 px-6">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-zinc-600 text-sm mb-2">Want even deeper insight?</p>
            <a href="https://hexaco-test-app.vercel.app" target="_blank" rel="noopener" className="inline-flex items-center gap-2 text-[#22D3EE] hover:text-[#06B6D4] font-medium transition-colors">
              Take the HEXACO Deep Personality Analysis <ArrowRight className="w-4 h-4" />
            </a>
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

export default function ResultsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-zinc-600" /></div>}>
      <ResultsContent />
    </Suspense>
  );
}
