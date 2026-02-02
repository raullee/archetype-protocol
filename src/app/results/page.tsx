"use client";

import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Suspense } from "react";

function Results() {
  const searchParams = useSearchParams();
  const archetypes = searchParams.get("archetypes")?.split(",") || [];
  const [primary, secondary, tertiary] = archetypes;

  const handleUnlock = async () => {
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ archetypes }),
    });
    const { url } = await response.json();
    window.location.href = url;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-obsidian-black font-sans p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-gray-900 p-8 rounded-2xl shadow-2xl text-center max-w-md w-full"
      >
        <h2 className="text-2xl font-serif text-electric-gold mb-2">
          Your Primary Archetype
        </h2>
        <h1 className="text-5xl font-serif font-bold text-alabaster-white mb-6">
          {primary}
        </h1>
        <p className="text-lg text-alabaster-white mb-6">
          Your profile detects a CRITICAL conflict with your secondary type.
        </p>
        <div className="text-center mb-6">
          <span className="text-4xl font-bold text-electric-gold line-through">
            $97
          </span>
          <span className="text-5xl font-bold text-electric-gold ml-4">
            $27
          </span>
        </div>
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px #C5A059" }}
          whileTap={{ scale: 0.95 }}
          onClick={handleUnlock}
          className="bg-electric-gold text-obsidian-black font-bold py-4 px-8 rounded-lg shadow-lg text-xl"
        >
          Unlock Full Dossier
        </motion.button>
      </motion.div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Results />
    </Suspense>
  );
}
