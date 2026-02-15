"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { QUESTIONS } from "@/lib/questions";
import { Archetype } from "@/lib/archetypes";
import { Loader2 } from "lucide-react";

export default function QuizPage() {
  const router = useRouter();
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Archetype[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [direction, setDirection] = useState(1);

  const question = QUESTIONS[currentQ];
  const progress = ((currentQ) / QUESTIONS.length) * 100;

  const handleAnswer = useCallback((archetype: Archetype) => {
    const newAnswers = [...answers, archetype];
    setAnswers(newAnswers);

    if (currentQ < QUESTIONS.length - 1) {
      setDirection(1);
      setCurrentQ((prev) => prev + 1);
    } else {
      setIsAnalyzing(true);
      setTimeout(() => {
        const encoded = encodeURIComponent(newAnswers.join(","));
        router.push(`/results?a=${encoded}`);
      }, 2500);
    }
  }, [answers, currentQ, router]);

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="relative w-20 h-20 mx-auto mb-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-20 h-20 rounded-full border-2 border-transparent border-t-[#6366F1] border-r-[#22D3EE]"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-3 h-3 rounded-full bg-[#6366F1]"
              />
            </div>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="font-serif text-2xl mb-2"
          >
            Analyzing your responses...
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-zinc-500 text-sm"
          >
            Mapping to Jungian archetypes
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0B] flex flex-col">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-white/[0.06]">
        <motion.div
          className="h-full bg-gradient-to-r from-[#6366F1] to-[#22D3EE]"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
      </div>

      {/* Question counter */}
      <div className="fixed top-6 right-6 z-50 text-sm text-zinc-600">
        {currentQ + 1} / {QUESTIONS.length}
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
              transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <p className="text-sm text-[#6366F1] font-medium mb-3 uppercase tracking-wider">
                {question.subtitle}
              </p>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-10 leading-tight">
                {question.question}
              </h1>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {question.options.map((option, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                    onClick={() => handleAnswer(option.archetype)}
                    className="text-left glass-card rounded-xl px-5 py-4 hover:bg-white/[0.06] hover:border-[#6366F1]/30 border border-white/[0.06] transition-all duration-300 group cursor-pointer"
                  >
                    <span className="text-sm text-zinc-300 group-hover:text-[#F5F5F7] transition-colors">
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
