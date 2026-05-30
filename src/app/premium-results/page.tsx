"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { ARCHETYPE_DATA, Archetype } from "@/lib/archetypes";
import { ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";

function PremiumContent() {
  const searchParams = useSearchParams();
  const archetypesParam = searchParams.get("archetypes") || "";
  const archetypes = archetypesParam.split(",").filter(Boolean) as Archetype[];
  const primary = archetypes[0] as Archetype | undefined;
  const data = primary ? ARCHETYPE_DATA[primary] : null;

  if (!data || !primary) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-500 mb-4">No archetype data found.</p>
          <Link href="/test" className="text-[#6366F1] hover:underline">Take the quiz →</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0B] py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <CheckCircle className="w-12 h-12 text-[#22D3EE] mx-auto mb-4" />
          <h1 className="font-serif text-4xl font-bold mb-2">Your Full Blueprint</h1>
          <p className="text-zinc-500">The {primary} Archetype — Complete Analysis</p>
        </div>

        <div className="space-y-8">
          {/* Relationship Blind Spot */}
          <section className="glass-card rounded-2xl p-8">
            <h2 className="font-serif text-xl font-bold mb-4 text-[#6366F1]">Your Relationship Blind Spot</h2>
            <p className="text-zinc-300 leading-relaxed">{data.relationshipStyle}</p>
          </section>

          {/* Career Alignment */}
          <section className="glass-card rounded-2xl p-8">
            <h2 className="font-serif text-xl font-bold mb-4 text-[#22D3EE]">Career Alignment Analysis</h2>
            <p className="text-zinc-400 text-sm mb-4">Top careers aligned with your archetype:</p>
            <ul className="space-y-2">
              {data.idealCareers.map((c) => (
                <li key={c} className="text-zinc-300 text-sm flex items-center gap-2">
                  <span className="text-[#22D3EE]">→</span> {c}
                </li>
              ))}
            </ul>
          </section>

          {/* Shadow Archetype */}
          <section className="glass-card rounded-2xl p-8">
            <h2 className="font-serif text-xl font-bold mb-4 text-[#F59E0B]">Your Shadow Archetype</h2>
            <p className="text-zinc-300 leading-relaxed">{data.shadowSide}</p>
          </section>

          {/* Famous Examples */}
          <section className="glass-card rounded-2xl p-8">
            <h2 className="font-serif text-xl font-bold mb-4">Famous {primary}s</h2>
            <div className="flex gap-4">
              {data.famousExamples.map((name) => (
                <span key={name} className="px-4 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sm text-zinc-300">{name}</span>
              ))}
            </div>
          </section>
        </div>

        <div className="text-center mt-12">
          <a href="https://hexaco.raul.my" target="_blank" rel="noopener" className="inline-flex items-center gap-2 text-[#22D3EE] hover:text-[#06B6D4] font-medium transition-colors">
            Go deeper with HEXACO Personality Analysis <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default function PremiumResultsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-zinc-600" /></div>}>
      <PremiumContent />
    </Suspense>
  );
}
