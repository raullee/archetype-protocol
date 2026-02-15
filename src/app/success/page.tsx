"use client";

import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <CheckCircle className="w-16 h-16 text-[#22D3EE] mx-auto mb-6" />
        <h1 className="font-serif text-3xl font-bold mb-4">Payment Successful!</h1>
        <p className="text-zinc-400 mb-8">Your full archetype blueprint is being prepared. Check your email for access.</p>
        <Link href="/" className="text-[#6366F1] hover:underline">← Back to home</Link>
      </div>
    </div>
  );
}
