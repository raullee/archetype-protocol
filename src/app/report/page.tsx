"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Download, Share2, ArrowLeft, Loader2, Star, Quote } from 'lucide-react';
import { ARCHETYPE_DATA, Archetype } from '@/lib/archetypes';
import { trackReportDownload, trackReportShare } from "@/lib/analytics";

interface ReportSection {
  title: string;
  content: string;
  pullQuote?: string;
}

interface GeneratedReport {
  tier: string;
  primary: Archetype;
  secondary: Archetype;
  primary2?: Archetype;
  secondary2?: Archetype;
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

  // Get params from URL
  const archetypes = searchParams.get('archetypes')?.split(',') || [];
  const tier = searchParams.get('tier') || 'full';
  const sessionId = searchParams.get('session_id');

  const primary = archetypes[0] as Archetype;
  const secondary = archetypes[1] as Archetype;
  const primary2 = archetypes[2] as Archetype;
  const secondary2 = archetypes[3] as Archetype;

  useEffect(() => {
    if (!primary || !secondary) {
      setError('Invalid archetype parameters');
      setLoading(false);
      return;
    }

    generateReport();
  }, [primary, secondary, tier]);

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
          primary2,
          secondary2,
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

      // Get the PDF blob
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Generate filename
      const archetypeName = report.tier === 'couples' 
        ? `${report.primary}-${report.secondary}-x-${report.primary2}-${report.secondary2}`
        : `${report.primary}-${report.secondary}`;
      
      link.download = `Archetype-Protocol-${archetypeName}-Blueprint.pdf`;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
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
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-cyan-400 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-serif font-bold mb-2">Crafting Your Report</h2>
          <p className="text-zinc-400 mb-4">This takes 30-60 seconds. AI is analyzing your artistic archetype...</p>
          <div className="w-64 h-2 bg-zinc-800 rounded-full mx-auto">
            <div className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full animate-pulse w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl">⚠️</span>
          </div>
          <h1 className="font-serif text-3xl font-bold mb-4 text-red-400">Generation Failed</h1>
          <p className="text-zinc-400 mb-8">{error}</p>
          <div className="space-x-4">
            <button
              onClick={generateReport}
              className="bg-cyan-600 hover:bg-cyan-500 px-6 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
            <Link href="/" className="text-zinc-400 hover:underline">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center">
        <p className="text-zinc-400">No report data available</p>
      </div>
    );
  }

  const primaryArchetypeData = ARCHETYPE_DATA[report.primary];
  const accentColor = primaryArchetypeData.accentColor;

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      {/* Header */}
      <div className="sticky top-0 bg-[#0A0A0B]/80 backdrop-blur-sm border-b border-zinc-800 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleDownloadPDF}
              className="flex items-center space-x-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={handleShare}
              className="flex items-center space-x-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors"
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
            <div 
              className="w-20 h-20 rounded-full flex items-center justify-center text-3xl"
              style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
            >
              {primaryArchetypeData.icon}
            </div>
          </div>
          
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            {tier === 'basic' ? 'Your Artist Archetype Profile' :
             tier === 'full' ? 'Your Complete Artist Blueprint' :
             'Creative Partnership Analysis'}
          </h1>
          
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span 
              className="px-4 py-1 rounded-full text-sm font-medium"
              style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
            >
              {report.primary}
            </span>
            <span className="text-zinc-400">+</span>
            <span 
              className="px-4 py-1 rounded-full text-sm font-medium"
              style={{ backgroundColor: `${ARCHETYPE_DATA[report.secondary].accentColor}20`, color: ARCHETYPE_DATA[report.secondary].accentColor }}
            >
              {report.secondary}
            </span>
            {report.primary2 && report.secondary2 && (
              <>
                <span className="text-zinc-400">×</span>
                <span 
                  className="px-4 py-1 rounded-full text-sm font-medium"
                  style={{ backgroundColor: `${ARCHETYPE_DATA[report.primary2].accentColor}20`, color: ARCHETYPE_DATA[report.primary2].accentColor }}
                >
                  {report.primary2}
                </span>
                <span className="text-zinc-400">+</span>
                <span 
                  className="px-4 py-1 rounded-full text-sm font-medium"
                  style={{ backgroundColor: `${ARCHETYPE_DATA[report.secondary2].accentColor}20`, color: ARCHETYPE_DATA[report.secondary2].accentColor }}
                >
                  {report.secondary2}
                </span>
              </>
            )}
          </div>
          
          <div className="flex items-center justify-center space-x-4 text-sm text-zinc-400">
            <span>{report.metadata.wordCount.toLocaleString()} words</span>
            <span>•</span>
            <span>{new Date(report.metadata.generatedAt).toLocaleDateString()}</span>
            <span>•</span>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 fill-current text-yellow-400" />
              <span className="text-yellow-400 font-medium">{tier.toUpperCase()}</span>
            </div>
          </div>
        </div>

        {/* Report Sections */}
        <div className="space-y-16">
          {report.sections.map((section, index) => (
            <section key={index} className="relative">
              {/* Section divider */}
              {index > 0 && (
                <div className="flex items-center justify-center mb-16">
                  <div className="h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent w-full max-w-md"></div>
                </div>
              )}

              <div className="prose prose-invert max-w-none">
                <h2 
                  className="text-3xl font-serif font-bold mb-8 border-l-4 pl-6"
                  style={{ borderColor: accentColor }}
                >
                  {section.title}
                </h2>
                
                {/* Pull quote */}
                {section.pullQuote && (
                  <div className="relative my-8 p-6 rounded-lg" style={{ backgroundColor: `${accentColor}10` }}>
                    <Quote className="w-8 h-8 text-zinc-600 mb-4" />
                    <blockquote 
                      className="text-xl font-medium leading-relaxed italic"
                      style={{ color: accentColor }}
                    >
                      "{section.pullQuote}"
                    </blockquote>
                  </div>
                )}

                <div 
                  className="text-lg leading-relaxed text-zinc-300"
                  dangerouslySetInnerHTML={{ 
                    __html: formatContent(section.content) 
                  }}
                />
              </div>
            </section>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-24 pt-12 border-t border-zinc-800 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
              style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
            >
              {primaryArchetypeData.icon}
            </div>
            <span className="text-zinc-400">Archetype Protocol</span>
          </div>
          <p className="text-sm text-zinc-500 mb-4">
            Generated with AI on {new Date(report.metadata.generatedAt).toLocaleDateString()}
          </p>
          <Link
            href="/"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
          >
            <span>Discover More Archetypes</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ReportPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-zinc-900 text-white flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading report...</span>
        </div>
      </div>
    }>
      <ReportContent />
    </Suspense>
  );
}

function formatContent(content: string): string {
  // Convert markdown-like formatting to HTML
  return content
    // Bold text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Italic text
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Line breaks
    .replace(/\n/g, '<br>')
    // Remove extra quotes from pull quotes since we handle them separately
    .replace(/^"(.*?)"$/gm, '$1');
}