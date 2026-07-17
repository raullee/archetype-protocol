"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Brain, Eye, ChevronRight, Crown, Palette, Heart, Sun, BookOpen, Compass, Zap, Sparkles, Shield, HeartHandshake, Laugh, Users } from "lucide-react";
import { ALL_ARCHETYPES, ARCHETYPE_DATA } from "@/lib/archetypes";
import { trackCtaClick } from "@/lib/analytics";

const ICON_MAP: Record<string, React.ElementType> = {
  Crown, Palette, Heart, Sun, BookOpen, Compass, Zap, Sparkles, Shield, HeartHandshake, Laugh, Users,
};

const HERO_EMOJIS = ALL_ARCHETYPES.map((a) => ARCHETYPE_DATA[a].emoji);

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } }),
};

const SHAPE_COLORS = ["#D02020", "#1040C0", "#F0C020"];

// Lightning Background SVG overlay
function LightningBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Lightning glow flash */}
      <div
        className="absolute inset-0 bg-white/10"
        style={{ animation: 'lightning-glow 4s ease-in-out infinite' }}
      />
      <div
        className="absolute inset-0 bg-white/5"
        style={{ animation: 'lightning-glow 5s ease-in-out 1.5s infinite' }}
      />

      {/* Lightning bolt 1 - left side */}
      <svg
        className="absolute top-0 left-[15%] w-[200px] h-full"
        viewBox="0 0 200 800"
        fill="none"
        style={{ animation: 'lightning-flash 4s ease-in-out infinite' }}
      >
        <path
          d="M100 0 L85 180 L120 200 L70 400 L110 420 L50 650 L95 450 L60 430 L115 220 L80 200 L100 0Z"
          fill="#F0C020"
          opacity="0.9"
        />
        <path
          d="M100 0 L85 180 L120 200 L70 400 L110 420 L50 650 L95 450 L60 430 L115 220 L80 200 L100 0Z"
          fill="white"
          opacity="0.4"
        />
      </svg>

      {/* Lightning bolt 2 - right side */}
      <svg
        className="absolute top-[5%] right-[20%] w-[150px] h-[70%]"
        viewBox="0 0 150 600"
        fill="none"
        style={{ animation: 'lightning-flash-2 5s ease-in-out 0.8s infinite' }}
      >
        <path
          d="M75 0 L65 120 L90 140 L55 300 L80 310 L40 500 L70 330 L50 320 L85 150 L60 130 L75 0Z"
          fill="#F0C020"
          opacity="0.8"
        />
        <path
          d="M75 0 L65 120 L90 140 L55 300 L80 310 L40 500 L70 330 L50 320 L85 150 L60 130 L75 0Z"
          fill="white"
          opacity="0.3"
        />
      </svg>

      {/* Lightning bolt 3 - center-right, smaller */}
      <svg
        className="absolute top-[15%] left-[55%] w-[100px] h-[50%]"
        viewBox="0 0 100 400"
        fill="none"
        style={{ animation: 'lightning-flash-3 6s ease-in-out 2s infinite' }}
      >
        <path
          d="M50 0 L42 90 L60 100 L35 220 L55 230 L25 380 L48 245 L33 238 L58 108 L42 100 L50 0Z"
          fill="white"
          opacity="0.7"
        />
      </svg>
    </div>
  );
}

// Geometric Logo (circle, square, triangle)
function BauhausLogo() {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-4 h-4 rounded-full bg-[#D02020] border-2 border-[var(--ink)]" />
      <div className="w-4 h-4 bg-[#1040C0] border-2 border-[var(--ink)]" />
      <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-b-[14px] border-l-transparent border-r-transparent border-b-[#F0C020]" style={{ marginTop: '-1px' }} />
    </div>
  );
}

export default function LandingPage() {
  const [emojiIndex, setEmojiIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setEmojiIndex((prev) => (prev + 1) % HERO_EMOJIS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--paper)]">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b-4 border-[var(--ink)] bg-[var(--paper)]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BauhausLogo />
            <span className="font-black text-lg uppercase tracking-tighter">The Archetype Protocol</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="https://hexaco.raul.my" target="_blank" rel="noopener" className="text-sm font-bold uppercase tracking-wider text-[var(--ink)]/50 hidden sm:block hover:text-[var(--ink)] transition-colors">
              Deep Personality Analysis
            </a>
            <Link href="/test" onClick={() => trackCtaClick("nav_bar", "/test")} className="btn-bauhaus-red btn-press px-5 py-2 text-sm inline-flex items-center gap-2">
              Take the Quiz
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero - Dark Blue with Lightning */}
      <section className="min-h-screen flex items-center justify-center px-6 relative bg-[#1040C0] overflow-hidden">
        <LightningBackground />

        {/* Dot grid subtle overlay */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.8) 2px, transparent 2px)',
          backgroundSize: '24px 24px',
        }} />

        <div className="max-w-5xl mx-auto text-center relative z-10 pt-16">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
            {/* Geometric shapes decoration */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-3 h-3 bg-[#D02020] border-2 border-white/40" />
              <span className="bauhaus-label text-white/60 text-xs">Jungian Archetype Framework</span>
              <div className="w-3 h-3 rounded-full bg-[#F0C020] border-2 border-white/40" />
            </div>

            <h1 className="font-black text-4xl sm:text-6xl lg:text-8xl uppercase tracking-tighter leading-[0.9] mb-6 text-white">
              Discover<br />
              Your <span className="text-[#F0C020]">Archetype</span>
            </h1>
            <p className="text-white/70 text-lg sm:text-xl max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
              The psychological framework used by the world&apos;s most self-aware people. 90 seconds. Zero fluff.
            </p>
            {/* Dual CTAs */}
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link href="/test" onClick={() => trackCtaClick("hero", "/test")} className="btn-bauhaus-red btn-press inline-flex items-center gap-2 font-bold px-8 py-4 text-lg">
                Begin Discovery <ArrowRight className="w-5 h-5" />
              </Link>
              <a href="#archetypes" className="btn-bauhaus-outline btn-press inline-flex items-center gap-2 px-8 py-4 text-lg">
                Explore Archetypes
              </a>
            </div>
          </motion.div>
        </div>

        {/* Bottom geometric decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-4 bg-[var(--ink)]" />
      </section>

      {/* Framework strip - Yellow section */}
      <section className="py-12 px-6 bg-[#F0C020] border-b-4 border-[var(--ink)]">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-8 text-sm text-[var(--ink)]">
          <div className="flex items-center gap-2">
            <span className="font-black text-lg">12</span>
            <span className="font-bold uppercase tracking-wider text-xs">Universal archetypes</span>
          </div>
          <div className="w-[4px] h-6 bg-[var(--ink)] hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="font-black text-lg">8</span>
            <span className="font-bold uppercase tracking-wider text-xs">Questions, ~90 seconds</span>
          </div>
          <div className="w-[4px] h-6 bg-[var(--ink)] hidden sm:block" />
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            <span className="font-bold uppercase tracking-wider text-xs">Based on Jungian Psychology</span>
          </div>
        </div>
      </section>

      {/* 12 Archetypes Grid */}
      <section id="archetypes" className="py-24 px-6 dot-grid-light">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-3 h-3 bg-[#D02020]" />
              <span className="bauhaus-label text-[var(--ink)]/50">The Framework</span>
              <div className="w-3 h-3 rounded-full bg-[#1040C0]" />
            </div>
            <h2 className="font-black text-3xl sm:text-5xl lg:text-6xl uppercase tracking-tighter leading-[0.9] mb-4">12 Universal<br />Archetypes</h2>
            <p className="text-[var(--ink)]/50 max-w-xl mx-auto font-medium">Ancient patterns of personality that shape how you think, lead, love, and create.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {ALL_ARCHETYPES.map((name, i) => {
              const data = ARCHETYPE_DATA[name];
              const Icon = ICON_MAP[data.icon] || Sparkles;
              const shapeColor = SHAPE_COLORS[i % 3];
              const shapeType = i % 3; // 0=circle, 1=square, 2=triangle
              return (
                <motion.div
                  key={name}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  className="bauhaus-card p-6 relative group cursor-default"
                >
                  {/* Geometric decoration in top-right */}
                  <div className="absolute top-3 right-3">
                    {shapeType === 0 && <div className="w-3 h-3 rounded-full" style={{ background: shapeColor }} />}
                    {shapeType === 1 && <div className="w-3 h-3" style={{ background: shapeColor }} />}
                    {shapeType === 2 && <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[10px] border-l-transparent border-r-transparent" style={{ borderBottomColor: shapeColor }} />}
                  </div>
                  <div className="w-10 h-10 flex items-center justify-center mb-3 border-2 border-[var(--ink)]" style={{ background: shapeColor + '20' }}>
                    <Icon className="w-5 h-5 text-[var(--ink)]" />
                  </div>
                  <h3 className="font-bold text-lg tracking-tight mb-1">{data.emoji} {name}</h3>
                  <p className="text-[var(--ink)]/50 text-sm leading-relaxed font-medium">{data.tagline}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section divider */}
      <div className="section-divider" />

      {/* How It Works */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="bauhaus-label text-[var(--ink)]/50 block mb-4">The Process</span>
            <h2 className="font-black text-3xl sm:text-5xl uppercase tracking-tighter leading-[0.9]">How It Works</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden sm:block absolute top-[40px] left-[16.67%] right-[16.67%] h-[4px] bg-[var(--ink)] z-0" />
            {[
              { icon: Eye, title: "Answer intuitively", desc: "8 questions. Go with your gut -- no right or wrong answers.", color: "#D02020", shape: "circle" },
              { icon: Sparkles, title: "Your archetype is revealed", desc: "Our algorithm maps your responses to Jungian archetypes instantly.", color: "#1040C0", shape: "square" },
              { icon: ChevronRight, title: "Unlock your blueprint", desc: "Get your personalized career, relationship, and growth analysis.", color: "#F0C020", shape: "triangle" },
            ].map((step, i) => (
              <motion.div key={i} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center relative z-10">
                <div className="relative mx-auto mb-5">
                  <div className="w-20 h-20 border-4 border-[var(--ink)] flex items-center justify-center mx-auto shadow-hard-sm" style={{ background: step.color }}>
                    <span className="font-black text-2xl text-white">{i + 1}</span>
                  </div>
                </div>
                <h3 className="font-bold text-lg uppercase tracking-tight mb-2">{step.title}</h3>
                <p className="text-[var(--ink)]/50 text-sm leading-relaxed font-medium">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section divider */}
      <div className="section-divider" />

      {/* Sample Insight Preview - Red section */}
      <section className="py-24 px-6 bg-[#D02020]">
        <div className="max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="bauhaus-card p-10 relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <span className="bauhaus-label text-[11px] bg-[#F0C020] text-[var(--ink)] px-3 py-1 border-2 border-[var(--ink)]">
                AI-Generated Analysis
              </span>
            </div>
            {/* Geometric decoration */}
            <div className="absolute top-3 left-3 w-4 h-4 rounded-full bg-[#1040C0]" />
            <h3 className="font-black text-2xl uppercase tracking-tighter mb-1 mt-2">Your Sage-Explorer Profile</h3>
            <p className="text-[var(--ink)]/50 text-sm mb-6 bauhaus-label">Primary: Sage / Secondary: Explorer</p>
            <div className="space-y-4">
              {["Relationship Blind Spot", "Career Alignment", "Shadow Archetype", "Growth Roadmap"].map((title, idx) => (
                <div key={title}>
                  <h4 className="text-sm font-bold mb-2 flex items-center gap-2 uppercase tracking-wider">
                    <div className="w-4 h-4 border-2 border-[var(--ink)] flex items-center justify-center" style={{ background: SHAPE_COLORS[idx % 3] + '30' }}>
                      <span className="text-[8px] font-black">+</span>
                    </div>
                    {title}
                  </h4>
                  <div className="space-y-1">
                    <div className="h-4 bg-[var(--paper-elev)] w-full" />
                    <div className="h-4 bg-[var(--paper-elev)] w-4/5" />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section divider */}
      <div className="section-divider" />

      {/* What the report reveals - Blue section */}
      <section className="py-24 px-6 bg-[#1040C0]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="bauhaus-label text-white/50 block mb-4">Inside the report</span>
            <h2 className="font-black text-3xl sm:text-4xl uppercase tracking-tighter text-white">What You&rsquo;ll Uncover</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { title: "Your creative blind spot", body: "The pattern that quietly stalls your work, named plainly, with the specific trigger that sets it off.", shape: 0 },
              { title: "Your shadow archetype", body: "The version of you that takes over under pressure, and why it feels justified in the moment.", body2: "", shape: 1 },
              { title: "Your artist positioning", body: "How your archetype reads to an audience, and the lane where it lands hardest.", shape: 2 },
            ].map((t, i) => (
              <motion.div key={i} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="bauhaus-card p-8 relative">
                {/* Geometric shape in corner */}
                <div className="absolute top-3 right-3">
                  {t.shape === 0 && <div className="w-3 h-3 rounded-full bg-[#D02020]" />}
                  {t.shape === 1 && <div className="w-3 h-3 bg-[#F0C020]" />}
                  {t.shape === 2 && <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[10px] border-l-transparent border-r-transparent border-b-[#D02020]" />}
                </div>
                <h3 className="font-black uppercase tracking-tight text-lg mb-3">{t.title}</h3>
                <p className="text-[var(--ink)]/60 text-sm leading-relaxed font-medium">{t.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section divider */}
      <div className="section-divider" />

      {/* Final CTA */}
      <section className="py-32 px-6 dot-grid-light">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            {/* Geometric decorations */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-6 h-6 rounded-full bg-[#D02020] border-2 border-[var(--ink)]" />
              <div className="w-6 h-6 bg-[#1040C0] border-2 border-[var(--ink)]" />
              <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-b-[20px] border-l-transparent border-r-transparent border-b-[#F0C020]" />
            </div>
            <h2 className="font-black text-5xl sm:text-6xl lg:text-7xl uppercase tracking-tighter leading-[0.9] mb-4">Ready?</h2>
            <p className="text-[var(--ink)]/50 text-lg mb-8 font-medium">Discover your archetype in 90 seconds</p>
            <Link href="/test" onClick={() => trackCtaClick("footer_cta", "/test")} className="btn-bauhaus-red btn-press inline-flex items-center gap-2 font-bold px-10 py-4 text-lg">
              Start Now <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-4 border-[var(--ink)] py-12 px-6 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <div className="flex items-center gap-3">
            <BauhausLogo />
            <span className="font-bold uppercase tracking-tighter">The Archetype Protocol</span>
          </div>
          <div className="flex items-center gap-6 font-bold uppercase tracking-wider text-xs text-[var(--ink)]/50">
            <a href="https://hexaco.raul.my" target="_blank" rel="noopener" className="hover:text-[var(--ink)] transition-colors">Deep Personality Analysis</a>
            <span>Privacy</span>
            <span>Terms</span>
          </div>
          <span className="font-bold">&copy; 2026</span>
        </div>
      </footer>
    </div>
  );
}
