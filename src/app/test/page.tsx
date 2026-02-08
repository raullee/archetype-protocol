"use client";

import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { questions } from "@/lib/questions";
import { calculateArchetype } from "@/utils/calculateArchetype";
import { Archetype } from "@/lib/archetypes";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

function TestPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showLoading, setShowLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const isBypass = searchParams?.get("bypass") === "true";
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswer = (archetype: string) => {
    const newAnswers = [...answers, archetype];
    setAnswers(newAnswers);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowLoading(true);
      setTimeout(() => {
        const result = calculateArchetype(newAnswers as Archetype[]);
        if (isBypass) {
          router.push(`/results?archetypes=${result.join(",")}&bypass=true`);
        } else {
          router.push(`/results?archetypes=${result.join(",")}`);
        }
      }, 2000);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setAnswers(answers.slice(0, -1));
    }
  };

  if (showLoading) {
    return (
      <div className="min-h-screen bg-obsidian-black flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-cyber-teal border-t-electric-gold rounded-full mx-auto mb-6"
          />
          <h2 className="text-2xl font-bold text-alabaster-white mb-2">
            Analyzing Your Artistic Personality...
          </h2>
          <p className="text-gray-400">
            Processing your responses to determine your unique archetype combination
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-obsidian-black text-alabaster-white">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 bg-obsidian-black/90 backdrop-blur-sm border-b border-gray-800 z-40"
      >
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-cyber-teal hover:text-electric-gold hover:bg-cyber-teal/10">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="border-gray-700 text-gray-400">
                <Clock className="w-3 h-3 mr-1" />
                ~{Math.max(0, questions.length - currentQuestion)} min left
              </Badge>
              <Badge className="bg-cyber-teal text-obsidian-black">
                {currentQuestion + 1}/{questions.length}
              </Badge>
            </div>
          </div>
          
          {/* Progress Bar */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-2"
          >
            <Progress value={progress} className="h-2" />
            <div className="text-xs text-gray-400 text-right">
              {Math.round(progress)}% Complete
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Question Content */}
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)] px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 100, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -100, scale: 0.95 }}
            transition={{ 
              duration: 0.6, 
              ease: [0.22, 1, 0.36, 1] // Custom easing for smoother animation
            }}
            className="w-full max-w-4xl mx-auto"
          >
            {/* Question Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center mb-8"
            >
              <Badge variant="secondary" className="mb-4 bg-gray-800 text-gray-300">
                Question {currentQuestion + 1} of {questions.length}
              </Badge>
              
              <h1 className="text-3xl md:text-5xl font-serif font-bold text-alabaster-white mb-6 leading-tight">
                {questions[currentQuestion].question}
              </h1>
              
              <p className="text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed">
                Choose the option that best describes how you would naturally respond in this situation.
              </p>
            </motion.div>

            {/* Answer Options */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid gap-4 mb-8 max-w-3xl mx-auto"
            >
              {questions[currentQuestion].answers.map((answer, index) => (
                <motion.div
                  key={answer.text}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: 0.1 * (index + 1),
                    ease: [0.22, 1, 0.36, 1]
                  }}
                >
                  <Card 
                    className="group cursor-pointer bg-gray-900/50 border-gray-700 hover:border-cyber-teal/50 hover:bg-cyber-teal/5 transition-all duration-300 hover:shadow-lg hover:shadow-cyber-teal/20"
                    onClick={() => handleAnswer(answer.archetype)}
                  >
                    <CardContent className="p-6">
                      <motion.div 
                        className="flex items-start gap-4"
                        whileHover={{ x: 4 }}
                        transition={{ duration: 0.2 }}
                      >
                        <motion.div 
                          className="w-10 h-10 bg-gray-700 group-hover:bg-cyber-teal rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 flex-shrink-0"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.2 }}
                        >
                          {String.fromCharCode(65 + index)}
                        </motion.div>
                        <div className="flex-1">
                          <p className="text-lg leading-relaxed text-alabaster-white group-hover:text-white transition-colors">
                            {answer.text}
                          </p>
                        </div>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* Navigation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex justify-center"
            >
              {currentQuestion > 0 && (
                <Button
                  variant="ghost"
                  onClick={handlePrevious}
                  className="text-gray-400 hover:text-alabaster-white hover:bg-gray-800"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous Question
                </Button>
              )}
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Question Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex gap-2 mt-8"
        >
          {questions.map((_, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.05 * index }}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index < currentQuestion
                  ? "bg-electric-gold shadow-lg shadow-electric-gold/50"
                  : index === currentQuestion
                  ? "bg-cyber-teal shadow-lg shadow-cyber-teal/50 scale-125"
                  : "bg-gray-700"
              }`}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}

function TestPageWrapper() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-obsidian-black text-electric-gold">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-electric-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading quiz...</p>
        </div>
      </div>
    }>
      <TestPage />
    </Suspense>
  );
}

export default TestPageWrapper;