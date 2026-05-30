"use client";

import { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, Loader2 } from "lucide-react";
import { trackPaymentSuccess, captureAttribution } from "@/lib/analytics";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const archetypes = searchParams.get('archetypes');
  const tier = searchParams.get('tier') || 'full';
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    captureAttribution();
    if (archetypes) {
      const primaryArchetype = archetypes.split(",")[0] || "Unknown";
      // Pass session_id as transaction_id so GA4 dedupes purchase events.
      trackPaymentSuccess(tier, primaryArchetype, sessionId || undefined);
    }
  }, [archetypes, tier, sessionId]);

  useEffect(() => {
    // Redirect to report page after payment success
    if (archetypes) {
      const reportUrl = `/report?archetypes=${archetypes}&tier=${tier}&session_id=${sessionId || ''}`;
      
      // Small delay to show success message briefly
      setTimeout(() => {
        router.push(reportUrl);
      }, 2000);
    }
  }, [archetypes, tier, sessionId, router]);

  return (
    <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <CheckCircle className="w-16 h-16 text-[#22D3EE] mx-auto mb-6" />
        <h1 className="font-serif text-3xl font-bold mb-4">Payment Successful!</h1>
        {archetypes ? (
          <>
            <p className="text-zinc-400 mb-4">Generating your personalized report...</p>
            <div className="flex items-center justify-center mb-8">
              <Loader2 className="w-6 h-6 text-cyan-400 animate-spin mr-2" />
              <span className="text-sm text-cyan-400">Redirecting to your report</span>
            </div>
          </>
        ) : (
          <p className="text-zinc-400 mb-8">Your archetype report is being prepared. You'll be redirected shortly.</p>
        )}
        
        {/* Manual link in case auto-redirect fails */}
        {archetypes && (
          <a
            href={`/report?archetypes=${archetypes}&tier=${tier}&session_id=${sessionId || ''}`}
            className="text-[#6366F1] hover:underline text-sm"
          >
            Click here if you're not redirected automatically
          </a>
        )}
        <p className="mt-8 text-xs text-zinc-500">
          Want this read in person?{" "}
          <a href="https://book.raul.my" target="_blank" rel="noopener" className="text-[#22D3EE] hover:underline">
            Work with Raul &rarr;
          </a>
        </p>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-zinc-900 text-white flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
