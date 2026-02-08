"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Play, ArrowRight, Star, CheckCircle, Users, Zap } from "lucide-react";
import Link from "next/link";

// Test Bypass Component
function TestBypass() {
  const [bypassId, setBypassId] = useState("");
  const [showBypass, setShowBypass] = useState(false);

  const handleBypass = () => {
    if (bypassId === "ARCH2026") {
      window.location.href = "/test?bypass=true";
    }
  };

  if (!showBypass) {
    return (
      <div className="fixed bottom-4 left-4 z-50">
        <button
          onClick={() => setShowBypass(true)}
          className="text-xs text-gray-500 hover:text-gray-300 px-2 py-1 bg-gray-800/50 rounded"
        >
          Dev
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-gray-900 p-4 rounded-lg border border-gray-700">
      <input
        type="text"
        value={bypassId}
        onChange={(e) => setBypassId(e.target.value)}
        placeholder="Bypass ID"
        className="bg-gray-800 text-white px-2 py-1 rounded text-sm mb-2 w-full"
      />
      <div className="flex gap-2">
        <button
          onClick={handleBypass}
          className="bg-cyber-teal text-white px-2 py-1 rounded text-xs hover:bg-cyber-teal/80"
        >
          Test
        </button>
        <button
          onClick={() => setShowBypass(false)}
          className="bg-gray-700 text-white px-2 py-1 rounded text-xs hover:bg-gray-600"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default function Home() {
  const heroRef = useRef(null);
  const painRef = useRef(null);
  const solutionRef = useRef(null);
  const proofRef = useRef(null);
  const ctaRef = useRef(null);
  
  const heroInView = useInView(heroRef, { once: true, margin: "-100px" });
  const painInView = useInView(painRef, { once: true, margin: "-100px" });
  const solutionInView = useInView(solutionRef, { once: true, margin: "-100px" });
  const proofInView = useInView(proofRef, { once: true, margin: "-100px" });
  const ctaInView = useInView(ctaRef, { once: true, margin: "-100px" });

  const scrollToSection = (ref: any) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <div className="min-h-screen bg-obsidian-black text-alabaster-white font-sans overflow-x-hidden">
        {/* Hero Section */}
        <motion.section
          ref={heroRef}
          initial={{ opacity: 0 }}
          animate={heroInView ? { opacity: 1 } : {}}
          transition={{ duration: 1 }}
          className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-gradient-to-br from-cyber-teal/20 to-electric-gold/20" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM0NUEyOUUiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxLjUiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
          </div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={heroInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative z-10 max-w-4xl"
          >
            <h1 className="text-6xl md:text-7xl font-serif font-bold mb-6 bg-gradient-to-r from-electric-gold via-cyber-teal to-electric-gold bg-clip-text text-transparent leading-tight">
              Your Musician Archetype
              <br />
              <span className="text-5xl md:text-6xl">Revealed</span>
            </h1>
            
            <motion.p
              initial={{ y: 30, opacity: 0 }}
              animate={heroInView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed"
            >
              The secret personality framework that successful musicians use to build profitable careers and find their unique path to success.
            </motion.p>

            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={heroInView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            >
              <button
                onClick={() => scrollToSection(painRef)}
                className="group bg-gradient-to-r from-electric-gold to-cyber-teal text-obsidian-black font-bold py-4 px-8 rounded-lg text-lg hover:scale-105 transition-all duration-300 shadow-2xl border border-electric-gold/20"
              >
                <span className="flex items-center gap-2">
                  Discover Your Type
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
              
              <button className="group flex items-center gap-2 text-cyber-teal hover:text-electric-gold transition-colors">
                <Play className="w-6 h-6" />
                <span className="font-semibold">Watch 2-min Demo</span>
              </button>
            </motion.div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={heroInView ? { scale: 1, opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex items-center justify-center gap-8 text-sm text-gray-400"
            >
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-electric-gold" />
                <span>2,400+ Musicians Transformed</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyber-teal" />
                <span>5-min Assessment</span>
              </div>
            </motion.div>
          </motion.div>
        </motion.section>

        {/* Pain Point Section */}
        <motion.section
          ref={painRef}
          initial={{ opacity: 0, y: 100 }}
          animate={painInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="py-20 px-6 bg-gradient-to-b from-obsidian-black to-gray-900"
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={painInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl md:text-5xl font-serif font-bold mb-8 text-electric-gold"
            >
              The Brutal Truth About Music Careers
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={painInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid md:grid-cols-3 gap-8 mb-12"
            >
              <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                <h3 className="text-xl font-bold text-red-400 mb-3">95% Stay Broke</h3>
                <p className="text-gray-300">
                  Most musicians chase every opportunity without knowing their authentic archetype, leading to scattered efforts and financial struggle.
                </p>
              </div>
              
              <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                <h3 className="text-xl font-bold text-red-400 mb-3">Identity Crisis</h3>
                <p className="text-gray-300">
                  You're told to "find your sound" but have no framework for understanding your musical identity and market position.
                </p>
              </div>
              
              <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                <h3 className="text-xl font-bold text-red-400 mb-3">Wrong Strategy</h3>
                <p className="text-gray-300">
                  Copying other artists' success formulas instead of building revenue streams that align with your natural archetype.
                </p>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={painInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-xl text-gray-300 leading-relaxed"
            >
              The music industry rewards musicians who know exactly who they are. The question is:
              <span className="block text-2xl font-bold text-cyber-teal mt-4">
                What's your unique path to profit?
              </span>
            </motion.p>
          </div>
        </motion.section>

        {/* Solution Section */}
        <motion.section
          ref={solutionRef}
          initial={{ opacity: 0, y: 100 }}
          animate={solutionInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="py-20 px-6 bg-gradient-to-b from-gray-900 to-obsidian-black"
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={solutionInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl md:text-5xl font-serif font-bold mb-8 text-electric-gold"
            >
              The Musician Archetype System
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={solutionInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl text-gray-300 mb-12 leading-relaxed"
            >
              A scientific assessment that identifies your Primary and Secondary Archetypes,
              giving you a clear blueprint for which revenue streams to pursue, how to brand yourself,
              and what makes you uniquely profitable as a musician.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={solutionInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="grid md:grid-cols-2 gap-8"
            >
              <div className="bg-gradient-to-br from-cyber-teal/20 to-electric-gold/20 p-8 rounded-lg border border-cyber-teal/30">
                <CheckCircle className="w-12 h-12 text-cyber-teal mb-4 mx-auto" />
                <h3 className="text-2xl font-bold mb-4">Know Your Type</h3>
                <p className="text-gray-300">
                  Discover your Primary and Secondary Archetypes from 6 distinct musician personalities,
                  each with specific strengths, ideal opportunities, and revenue strategies.
                </p>
              </div>

              <div className="bg-gradient-to-br from-electric-gold/20 to-cyber-teal/20 p-8 rounded-lg border border-electric-gold/30">
                <Users className="w-12 h-12 text-electric-gold mb-4 mx-auto" />
                <h3 className="text-2xl font-bold mb-4">Make More Money</h3>
                <p className="text-gray-300">
                  Focus on revenue streams that match your archetype, build your authentic brand,
                  and dramatically increase your income potential.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Social Proof */}
        <motion.section
          ref={proofRef}
          initial={{ opacity: 0, y: 100 }}
          animate={proofInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="py-20 px-6 bg-gradient-to-b from-obsidian-black to-gray-900"
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={proofInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-3xl md:text-4xl font-serif font-bold mb-12 text-electric-gold"
            >
              Trusted by Working Musicians
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={proofInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid md:grid-cols-3 gap-8"
            >
              <div className="bg-gray-800/50 p-6 rounded-lg">
                <div className="flex text-electric-gold mb-3">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-gray-300 mb-4">
                  "Finally understand why I was struggling financially. Now I focus on teaching and session work as The Virtuoso and my income tripled."
                </p>
                <p className="text-cyber-teal font-semibold">- Sarah M., Classical Guitarist</p>
              </div>

              <div className="bg-gray-800/50 p-6 rounded-lg">
                <div className="flex text-electric-gold mb-3">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-gray-300 mb-4">
                  "Discovered I'm a Producer/Collaborator combination. Changed my approach to networking and booked 3 major projects in a month."
                </p>
                <p className="text-cyber-teal font-semibold">- Marcus T., Hip-Hop Producer</p>
              </div>

              <div className="bg-gray-800/50 p-6 rounded-lg">
                <div className="flex text-electric-gold mb-3">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-gray-300 mb-4">
                  "This system revealed I was chasing the wrong revenue streams. Now I know my path as The Performer and bookings are consistent."
                </p>
                <p className="text-cyber-teal font-semibold">- Alex K., Singer-Songwriter</p>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          ref={ctaRef}
          initial={{ opacity: 0, y: 100 }}
          animate={ctaInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="py-20 px-6 bg-gradient-to-r from-cyber-teal to-electric-gold"
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={ctaInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl md:text-5xl font-serif font-bold mb-6 text-obsidian-black"
            >
              Ready to Discover Your Musician Archetype?
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={ctaInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl text-obsidian-black/80 mb-8 leading-relaxed"
            >
              Take our 5-minute assessment and get your detailed Musician Archetype Report
              <br />
              <span className="font-bold">Complete with revenue strategies and brand positioning</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={ctaInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Link href="/test">
                <button className="group bg-obsidian-black text-alabaster-white font-bold py-6 px-12 rounded-lg text-xl hover:scale-105 transition-all duration-300 shadow-2xl border-2 border-obsidian-black hover:border-white/20">
                  <span className="flex items-center gap-3">
                    Start Your Assessment
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                  </span>
                </button>
              </Link>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={ctaInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-obsidian-black/70 mt-6 text-sm"
            >
              ⚡ 5-minute assessment • 🎯 Instant results • 💎 Detailed report: $9.99
              <br />
              <span className="text-xs">
                <Link href="/hexaco" className="underline hover:text-obsidian-black">
                  Also check out our HEXACO Personality Test
                </Link>
              </span>
            </motion.p>
          </div>
        </motion.section>
      </div>

      <TestBypass />
    </>
  );
}