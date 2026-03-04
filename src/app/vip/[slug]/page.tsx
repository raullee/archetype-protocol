"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Crown, ArrowRight, Sparkles } from "lucide-react";
import { getVipBySlug, activateVipSession, VipUser } from "@/lib/whitelist";

export default function VipLandingPage() {
  const params = useParams();
  const router = useRouter();
  const slug = typeof params.slug === "string" ? params.slug : "";
  const [vip, setVip] = useState<VipUser | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const user = getVipBySlug(slug);
    if (user) {
      setVip(user);
      activateVipSession(user);
    } else {
      setNotFound(true);
    }
  }, [slug]);

  if (notFound) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-zinc-500 mb-4">This invite link is not recognized.</p>
          <a href="/" className="text-[#6366F1] hover:underline">Go to homepage &rarr;</a>
        </div>
      </div>
    );
  }

  if (!vip) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center">
        <Sparkles className="w-6 h-6 animate-spin text-[#6366F1]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="max-w-lg w-full text-center"
      >
        {/* VIP badge */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          className="inline-flex items-center gap-2 bg-[#F59E0B]/10 border border-[#F59E0B]/20 rounded-full px-5 py-2 mb-8"
        >
          <Crown className="w-4 h-4 text-[#F59E0B]" />
          <span className="text-sm font-medium text-[#F59E0B]">VIP Access</span>
        </motion.div>

        <h1 className="font-serif text-4xl sm:text-5xl font-bold mb-4">
          Hey, {vip.name}.
        </h1>

        {vip.greeting && (
          <p className="text-zinc-400 text-lg mb-3 leading-relaxed">
            {vip.greeting}
          </p>
        )}

        <p className="text-zinc-500 mb-10">
          You have <span className="text-[#F59E0B] font-medium">A-class access</span> — every premium section is unlocked for you automatically. No payment required.
        </p>

        {/* Perks */}
        <div className="grid grid-cols-2 gap-3 mb-10 text-left">
          {[
            "Relationship Blind Spot",
            "Career Alignment Analysis",
            "Shadow Archetype",
            "Growth Roadmap",
            "Decision-Making Style",
            "Character Arc Engine",
          ].map((perk) => (
            <div
              key={perk}
              className="flex items-center gap-2 text-sm text-zinc-400 bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2"
            >
              <span className="text-[#22D3EE]">&#10003;</span>
              {perk}
            </div>
          ))}
        </div>

        <button
          onClick={() => router.push("/test")}
          className="inline-flex items-center gap-2 bg-[#6366F1] hover:bg-[#5558E6] text-white font-medium px-8 py-4 rounded-xl text-lg transition-all hover:shadow-[0_0_40px_rgba(99,102,241,0.3)] cursor-pointer"
        >
          Begin Your Discovery <ArrowRight className="w-5 h-5" />
        </button>

        <p className="text-zinc-700 text-xs mt-6">
          Your results will be fully unlocked after the quiz.
        </p>
      </motion.div>
    </div>
  );
}
