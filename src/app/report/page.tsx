"use client";

import { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Download, Share2, ArrowLeft, Loader2, Quote } from 'lucide-react';
import { ARCHETYPE_DATA, Archetype } from '@/lib/archetypes';
import { trackReportDownload, trackReportShare } from "@/lib/analytics";

const SHAPE_COLORS = ["#D02020", "#1040C0", "#F0C020"];

interface ReportSection {
  title: string;
  content: string;
  pullQuote?: string;
}

interface GeneratedReport {
  tier: string;
  primary: Archetype;
  secondary: Archetype;
  sections: ReportSection[];
  metadata: {
    wordCount: number;
    generatedAt: string;
    archetypeColors: string[];
  };
}

function ReportContent() {
  const searchParams = useSearchParams();
  const [report, setReport] = useState<GeneratedReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [visibleSections, setVisibleSections] = useState<Set<number>>(new Set());
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  // Get params from URL
  const archetypes = searchParams.get('archetypes')?.split(',') || [];
  const tier = searchParams.get('tier') || 'full';

  const primary = archetypes[0] as Archetype;
  const secondary = archetypes[1] as Archetype;

  const setSectionRef = useCallback((el: HTMLElement | null, index: number) => {
    sectionRefs.current[index] = el;
  }, []);

  useEffect(() => {
    if (!primary || !secondary) {
      setError('Invalid archetype parameters');
      setLoading(false);
      return;
    }

    generateReport();
  }, [primary, secondary, tier]);

  // Section visibility tracking — no-ops until report renders sections.
  useEffect(() => {
    if (!report) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const idx = Number(entry.target.getAttribute('data-section-index'));
          if (!isNaN(idx) && entry.isIntersecting) {
            setCurrentSection(idx);
            setVisibleSections((prev) => new Set(prev).add(idx));
          }
        });
      },
      { threshold: 0.3 }
    );

    sectionRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [report]);

  const generateReport = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/generate-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          primary,
          secondary,
          tier
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate report');
      }

      const { report: generatedReport } = await response.json();
      setReport(generatedReport);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!report) return;
    trackReportDownload(report.primary, tier);

    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(report),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      const archetypeName = `${report.primary}-${report.secondary}`;

      link.download = `Archetype-Protocol-${archetypeName}-Blueprint.pdf`;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (err) {
      console.error('PDF download failed:', err);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const handleShare = async () => {
    trackReportShare(primary);
    if (navigator.share) {
      try {
        await navigator.share({
          title: `My Artist Archetype Report - ${primary}/${secondary}`,
          text: `Check out my ${tier} archetype report!`,
          url: window.location.href,
        });
      } catch (err) {
        navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0F0F0] flex items-center justify-center">
        <div className="text-center">
          {/* Geometric shapes rotating */}
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 bg-[#D02020] border-2 border-[#121212]" style={{ animation: 'shape-spin 3s linear infinite' }} />
            <div className="absolute bottom-0 left-2 w-8 h-8 rounded-full bg-[#1040C0] border-2 border-[#121212]" style={{ animation: 'shape-spin 4s linear infinite reverse' }} />
            <div className="absolute bottom-0 right-2 w-0 h-0 border-l-[16px] border-r-[16px] border-b-[28px] border-l-transparent border-r-transparent border-b-[#F0C020]" style={{ animation: 'shape-spin 5s linear infinite' }} />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tighter mb-2">Crafting Your Report</h2>
          <p className="text-[#121212]/50 mb-4 font-medium">This takes 30-60 seconds. AI is analyzing your artistic archetype...</p>
          <div className="w-64 h-3 bg-[#E0E0E0] border-2 border-[#121212] mx-auto overflow-hidden">
            <div className="h-full bg-[#D02020] animate-pulse w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F0F0F0] flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-[#D02020] border-4 border-[#121212] shadow-hard-sm flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl text-white font-black">!</span>
          </div>
          <h1 className="font-black text-3xl uppercase tracking-tighter mb-4 text-[#D02020]">Generation Failed</h1>
          <p className="text-[#121212]/50 mb-8 font-medium">{error}</p>
          <div className="space-x-4">
            <button
              onClick={generateReport}
              className="btn-bauhaus-red btn-press px-6 py-2 text-sm"
            >
              Try Again
            </button>
            <Link href="/" className="text-[#121212]/50 font-bold uppercase hover:text-[#121212]">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-[#F0F0F0] flex items-center justify-center">
        <p className="text-[#121212]/50 font-medium">No report data available</p>
      </div>
    );
  }

  const primaryArchetypeData = ARCHETYPE_DATA[report.primary];

  return (
    <div className="min-h-screen bg-[#F0F0F0] text-[#121212]">
      {/* Floating progress indicator */}
      {report.sections.length > 0 && (
        <div className="fixed bottom-6 right-6 z-40 bg-white border-2 border-[#121212] shadow-hard-sm px-4 py-2 flex items-center gap-2">
          <div className="w-3 h-3 bg-[#D02020]" />
          <span className="bauhaus-label text-[#121212]/50">Section {currentSection + 1} of {report.sections.length}</span>
        </div>
      )}

      {/* Header */}
      <div className="sticky top-0 bg-white border-b-4 border-[#121212] z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center text-[#121212]/50 hover:text-[#121212] transition-colors font-bold uppercase text-sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleDownloadPDF}
              className="btn-bauhaus-red btn-press flex items-center space-x-2 px-4 py-2 text-sm group"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={handleShare}
              className="btn-bauhaus-outline btn-press flex items-center space-x-2 px-4 py-2 text-sm"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Report Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 border-4 border-[#121212] shadow-hard-lg flex items-center justify-center text-3xl bg-white">
              {primaryArchetypeData.emoji}
            </div>
          </div>

          <h1 className="font-black text-4xl md:text-5xl uppercase tracking-tighter mb-4">
            {tier === 'basic' ? 'Your Artist Archetype Profile' : 'Your Complete Artist Blueprint'}
          </h1>

          <div className="flex items-center justify-center space-x-2 mb-4 flex-wrap">
            <span className="px-4 py-1 text-sm font-bold uppercase border-2 border-[#121212] bg-[#D02020] text-white">
              {report.primary}
            </span>
            <span className="text-[#121212]/30 font-black">+</span>
            <span className="px-4 py-1 text-sm font-bold uppercase border-2 border-[#121212] bg-white text-[#121212]/60">
              {report.secondary}
            </span>
          </div>

          <div className="flex items-center justify-center space-x-4 bauhaus-label text-[#121212]/40">
            <span>{report.metadata.wordCount.toLocaleString()} words</span>
            <span className="w-1 h-1 bg-[#121212]/30" />
            <span>{new Date(report.metadata.generatedAt).toLocaleDateString()}</span>
            <span className="w-1 h-1 bg-[#121212]/30" />
            <div className="flex items-center space-x-1">
              <span className="text-[#D02020] font-bold">{tier.toUpperCase()}</span>
            </div>
          </div>
        </div>

        {/* Report Sections */}
        <div className="space-y-16">
          {report.sections.map((section, index) => {
            const isVisible = visibleSections.has(index);
            return (
              <section
                key={index}
                ref={(el) => setSectionRef(el, index)}
                data-section-index={index}
                className="relative"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
                  transition: 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                {/* Section divider */}
                {index > 0 && (
                  <div className="flex items-center justify-center mb-16">
                    <div className="h-[4px] bg-[#121212] w-full max-w-md"></div>
                  </div>
                )}

                <div className="prose prose-neutral max-w-none">
                  {/* Section label with geometric shape */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3" style={{ background: SHAPE_COLORS[index % 3] }} />
                    <span className="bauhaus-label text-[#121212]/40">Section {index + 1}</span>
                  </div>

                  <h2 className="text-3xl font-black uppercase tracking-tighter mb-8 border-l-4 border-[#D02020] pl-6">
                    {section.title}
                  </h2>

                  {/* Pull quote -- yellow background, black border, hard shadow */}
                  {section.pullQuote && (
                    <div
                      className="relative my-8 p-6 bg-[#F0C020] border-4 border-[#121212] shadow-hard-lg"
                      style={{
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible ? 'translateX(0)' : 'translateX(-40px)',
                        transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s',
                      }}
                    >
                      <Quote className="w-8 h-8 text-[#121212]/30 mb-4" />
                      <blockquote className="text-xl font-bold leading-relaxed text-[#121212]">
                        &ldquo;{section.pullQuote}&rdquo;
                      </blockquote>
                    </div>
                  )}

                  <div
                    className="text-lg leading-relaxed text-[#121212]/60 font-medium"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                    dangerouslySetInnerHTML={{
                      __html: formatContent(section.content)
                    }}
                  />
                </div>
              </section>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-24 pt-12 border-t-4 border-[#121212] text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 border-2 border-[#121212] flex items-center justify-center text-sm bg-white">
              {primaryArchetypeData.emoji}
            </div>
            <span className="font-bold uppercase tracking-tighter">Archetype Protocol</span>
          </div>
          <p className="bauhaus-label text-[#121212]/30 mb-4">
            Generated with AI on {new Date(report.metadata.generatedAt).toLocaleDateString()}
          </p>
          <Link
            href="/"
            className="btn-bauhaus-outline btn-press inline-flex items-center space-x-2 px-6 py-3 text-sm"
          >
            <span>Discover More Archetypes</span>
          </Link>
          <p className="mt-8 text-sm font-medium text-[#121212]/50">
            Want this read in person?{" "}
            <a href="https://book.raul.my" target="_blank" rel="noopener" className="font-bold text-[#D02020] underline underline-offset-4 hover:text-[#121212] transition-colors">
              Work with Raul &rarr;
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ReportPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F0F0F0] text-[#121212] flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin text-[#D02020]" />
          <span className="text-[#121212]/50 font-medium">Loading report...</span>
        </div>
      </div>
    }>
      <ReportContent />
    </Suspense>
  );
}

function formatContent(content: string): string {
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>');
}
