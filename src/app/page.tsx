"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { questions } from "@/lib/questions";
import { calculateArchetype } from "@/utils/calculateArchetype";
import { useRouter } from "next/navigation";

export default function Home() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showLoading, setShowLoading] = useState(false);
  const router = useRouter();

  const handleAnswer = (archetype: string) => {
    setAnswers([...answers, archetype]);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const result = calculateArchetype([...answers, archetype]);
      router.push(`/results?archetypes=${result.join(",")}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-obsidian-black font-sans">
      <AnimatePresence>
        {currentQuestion < questions.length && !showLoading && (
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-2xl mx-auto text-center"
          >
            <h1 className="text-4xl font-serif font-bold text-alabaster-white mb-4">
              {questions[currentQuestion].question}
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {questions[currentQuestion].answers.map((answer) => (
                <motion.button
                  key={answer.text}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAnswer(answer.archetype)}
                  className="bg-cyber-teal text-alabaster-white font-bold py-4 px-6 rounded-lg shadow-lg"
                >
                  {answer.text}
                </motion.button>
              ))}
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5 mt-8">
              <motion.div
                className="bg-electric-gold h-2.5 rounded-full"
                initial={{ width: `${(currentQuestion / questions.length) * 100}%` }}
                animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <p className="text-sm text-gray-400 mt-2">Analyzing Psyche...</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
