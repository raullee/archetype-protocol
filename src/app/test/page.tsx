"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { QUESTIONS } from "@/lib/questions";
import { Archetype, ARCHETYPE_DATA, ALL_ARCHETYPES } from "@/lib/archetypes";
import { trackQuizStart, trackQuizComplete } from "@/lib/analytics";

const SHAPE_COLORS = ["#D02020", "#1040C0", "#F0C020"];

export default function QuizPage() {
  const router = useRouter();
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Archetype[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [direction, setDirection] = useState(1);
  const startTime = useRef(Date.now());

  // Track quiz start on mount
  useEffect(() => {
    trackQuizStart();
  }, []);

  const question = QUESTIONS[currentQ];
  const progress = ((currentQ) / QUESTIONS.length) * 100;

  const handleAnswer = useCallback((archetype: Archetype, e: React.MouseEvent) => {
    const newAnswers = [...answers, archetype];
    setAnswers(newAnswers);

    if (currentQ < QUESTIONS.length - 1) {
      setDirection(1);
      setCurrentQ((prev) => prev + 1);
    } else {
      setIsAnalyzing(true);
      const elapsed = Math.round((Date.now() - startTime.current) / 1000);
      const counts: Record<string, number> = {};
      newAnswers.forEach((a) => { counts[a] = (counts[a] || 0) + 1; });
      const topArchetype = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || "Unknown";
      trackQuizComplete(topArchetype, elapsed);
      setTimeout(() => {
        const encoded = encodeURIComponent(newAnswers.join(","));
        router.push(`/results?a=${encoded}&t=${elapsed}`);
      }, 3500);
    }
  }, [answers, currentQ, router]);

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-[#F0F0F0] flex items-center justify-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          {/* Geometric shapes assembling */}
          <div className="relative w-40 h-40 mx-auto mb-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-12 bg-[#D02020] border-4 border-[#121212]"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute bottom-2 left-4 w-12 h-12 rounded-full bg-[#1040C0] border-4 border-[#121212]"
            />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              className="absolute bottom-2 right-4"
            >
              <div className="w-0 h-0 border-l-[24px] border-r-[24px] border-b-[42px] border-l-transparent border-r-transparent border-b-[#F0C020]" style={{ filter: 'drop-shadow(0 0 0 #121212)' }} />
            </motion.div>
          </div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="font-black text-3xl uppercase tracking-tighter mb-2">
            Analyzing...
          </motion.p>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="text-[#121212]/50 text-sm bauhaus-label">
            Mapping to Jungian archetypes
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F0F0] flex flex-col">
      {/* Progress bar - geometric squares */}
      <div className="fixed top-0 left-0 right-0 z-50 h-2 bg-[#E0E0E0] border-b-2 border-[#121212]">
        <motion.div
          className="h-full bg-[#D02020]"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      {/* Question counter */}
      <div className="fixed top-6 right-6 z-50">
        <span className="bauhaus-label text-[#121212]/50 bg-white border-2 border-[#121212] px-4 py-2 shadow-hard-sm font-bold">
          {currentQ + 1} / {QUESTIONS.length}
        </span>
      </div>

      {/* Progress dots - geometric */}
      <div className="fixed top-6 left-6 z-50 flex gap-2">
        {QUESTIONS.map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 border-2 border-[#121212] transition-colors ${
              i < currentQ ? 'bg-[#D02020]' : i === currentQ ? 'bg-[#F0C020]' : 'bg-white'
            }`}
          />
        ))}
      </div>

      {/* Question */}
      <div className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentQ}
              custom={direction}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="bauhaus-label text-[#D02020] mb-4">
                {question.subtitle}
              </p>
              <h1 className="font-black text-3xl sm:text-4xl uppercase tracking-tighter mb-10 leading-tight">
                {question.question}
              </h1>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {question.options.map((option, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                    onClick={(e) => handleAnswer(option.archetype, e)}
                    className="text-left bg-white border-2 border-[#121212] px-6 py-5 shadow-hard-sm btn-press hover:bg-[#F0C020]/10 transition-colors group cursor-pointer relative"
                  >
                    {/* Small colored shape */}
                    <div className="absolute top-2 right-2">
                      {i % 3 === 0 && <div className="w-2 h-2 rounded-full" style={{ background: SHAPE_COLORS[i % 3] }} />}
                      {i % 3 === 1 && <div className="w-2 h-2" style={{ background: SHAPE_COLORS[i % 3] }} />}
                      {i % 3 === 2 && <div className="w-0 h-0 border-l-[4px] border-r-[4px] border-b-[7px] border-l-transparent border-r-transparent" style={{ borderBottomColor: SHAPE_COLORS[i % 3] }} />}
                    </div>
                    <span className="text-sm text-[#121212]/70 group-hover:text-[#121212] transition-colors font-medium">
                      {option.text}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
