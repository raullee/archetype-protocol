"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Star, Brain, Sparkles, Eye, Lock, ChevronRight, Crown, Palette, Heart, Sun, BookOpen, Compass, Zap, Shield, HeartHandshake, Laugh, Users } from "lucide-react";
import { ALL_ARCHETYPES, ARCHETYPE_DATA } from "@/lib/archetypes";

const ICON_MAP: Record<string, React.ElementType> = {
  Crown, Palette, Heart, Sun, BookOpen, Compass, Zap, Sparkles, Shield, HeartHandshake, Laugh, Users,
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } }),
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0B]">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/[0.06] bg-[#0A0A0B]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-serif text-lg tracking-tight">The Archetype Protocol</span>
          <div className="flex items-center gap-6">
            <a href="https://hexaco-test-app.vercel.app" target="_blank" rel="noopener" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors hidden sm:block">
              Deep Personality Analysis <ArrowRight className="inline w-3 h-3 ml-1" />
            </a>
            <Link href="/test" className="bg-[#6366F1] hover:bg-[#5558E6] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
              Take the Quiz
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-40 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}>
            <h1 className="font-serif text-5xl sm:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
              Discover Your<br />
              <span className="text-gradient">Core Archetype</span>
            </h1>
            <p className="text-zinc-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              The psychological framework used by the world&apos;s most self-aware people. 90 seconds. Zero fluff.
            </p>
            <Link href="/test" className="inline-flex items-center gap-2 bg-[#6366F1] hover:bg-[#5558E6] text-white font-medium px-8 py-4 rounded-xl text-lg transition-all hover:shadow-[0_0_40px_rgba(99,102,241,0.3)]">
              Begin Discovery <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="pb-20 px-6">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-8 text-sm text-zinc-500">
          <div className="flex items-center gap-2">
            <span className="text-[#F5F5F7] font-semibold">47,000+</span> archetypes revealed
          </div>
          <div className="w-px h-4 bg-white/10 hidden sm:block" />
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-[#FBBF24] text-[#FBBF24]" />)}
            <span className="ml-2">4.9/5</span>
          </div>
          <div className="w-px h-4 bg-white/10 hidden sm:block" />
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4" /> Based on Jungian psychology
          </div>
        </div>
      </section>

      {/* 12 Archetypes Grid */}
      <section className="pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-4">12 Universal Archetypes</h2>
            <p className="text-zinc-500 max-w-xl mx-auto">Ancient patterns of personality that shape how you think, lead, love, and create.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {ALL_ARCHETYPES.map((name, i) => {
              const data = ARCHETYPE_DATA[name];
              const Icon = ICON_MAP[data.icon] || Sparkles;
              return (
                <motion.div
                  key={name}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  className="glass-card rounded-xl p-5 group hover:glow-subtle transition-all duration-500 cursor-default"
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ background: `${data.accentColor}15` }}>
                    <Icon className="w-5 h-5" style={{ color: data.accentColor }} />
                  </div>
                  <h3 className="font-serif text-lg font-semibold mb-1">{data.emoji} {name}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">{data.tagline}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-center mb-16">How It Works</h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { icon: Eye, title: "Answer intuitively", desc: "8 questions. Go with your gut — no right or wrong answers." },
              { icon: Sparkles, title: "Your archetype is revealed", desc: "Our algorithm maps your responses to Jungian archetypes instantly." },
              { icon: ChevronRight, title: "Unlock your full blueprint", desc: "Get your personalized career, relationship, and growth analysis." },
            ].map((step, i) => (
              <motion.div key={i} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-[#6366F1]/10 flex items-center justify-center mx-auto mb-5">
                  <step.icon className="w-6 h-6 text-[#6366F1]" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Insight Preview */}
      <section className="pb-24 px-6">
        <div className="max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="glass-card rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-[#6366F1]/20 text-[#6366F1] text-xs font-medium px-3 py-1 rounded-full">
              AI-Generated Personal Analysis
            </div>
            <h3 className="font-serif text-2xl font-bold mb-1">Your Sage-Explorer Profile</h3>
            <p className="text-zinc-500 text-sm mb-6">Primary: Sage · Secondary: Explorer</p>
            <div className="space-y-4">
              {["Relationship Blind Spot", "Career Alignment", "Shadow Archetype", "Growth Roadmap"].map((title) => (
                <div key={title}>
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <Lock className="w-3 h-3 text-zinc-600" /> {title}
                  </h4>
                  <div className="space-y-1">
                    <div className="h-4 bg-white/[0.06] rounded blur-[6px] w-full" />
                    <div className="h-4 bg-white/[0.06] rounded blur-[6px] w-4/5" />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-center mb-16">What people are saying</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { quote: "Finally understood why I keep burning out. My Caregiver archetype explained everything.", name: "Rachel T.", role: "UX Designer" },
              { quote: "Shared my result with my team. Now we understand each other's working styles.", name: "David K.", role: "Product Manager" },
              { quote: "The career section was eerily accurate. Changed my entire job search strategy.", name: "Aisha M.", role: "Marketing Director" },
            ].map((t, i) => (
              <motion.div key={i} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="glass-card rounded-xl p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-[#FBBF24] text-[#FBBF24]" />)}
                </div>
                <p className="text-zinc-300 text-sm leading-relaxed mb-4">&ldquo;{t.quote}&rdquo;</p>
                <div className="text-sm">
                  <span className="text-[#F5F5F7] font-medium">{t.name}</span>
                  <span className="text-zinc-600 ml-2">{t.role}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="pb-32 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold mb-4">Ready?</h2>
            <p className="text-zinc-500 text-lg mb-8">Discover your archetype in 90 seconds</p>
            <Link href="/test" className="inline-flex items-center gap-2 bg-[#6366F1] hover:bg-[#5558E6] text-white font-medium px-8 py-4 rounded-xl text-lg transition-all hover:shadow-[0_0_40px_rgba(99,102,241,0.3)]">
              Start Now <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-zinc-600">
          <span className="font-serif">The Archetype Protocol</span>
          <div className="flex items-center gap-6">
            <a href="https://hexaco-test-app.vercel.app" target="_blank" rel="noopener" className="hover:text-zinc-400 transition-colors">Deep Personality Analysis</a>
            <span>Privacy</span>
            <span>Terms</span>
          </div>
          <span>© 2026</span>
        </div>
      </footer>
    </div>
  );
}
