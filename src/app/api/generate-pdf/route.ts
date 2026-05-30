import { NextRequest, NextResponse } from 'next/server';
import { jsPDF } from 'jspdf';
import { ARCHETYPE_DATA, Archetype } from '@/lib/archetypes';

export interface ReportSection {
  title: string;
  content: string;
  pullQuote?: string;
}

export interface GeneratedReport {
  tier: string;
  primary: string;
  secondary: string;
  sections: ReportSection[];
  metadata: {
    wordCount: number;
    generatedAt: string;
    archetypeColors: string[];
  };
}

const DARK_BG: [number, number, number] = [10, 10, 11]; // #0A0A0B
const WHITE_TEXT: [number, number, number] = [255, 255, 255];
const GRAY_TEXT: [number, number, number] = [153, 153, 153];
const LIGHT_GRAY_TEXT: [number, number, number] = [204, 204, 204];

// Helper function to convert hex color to RGB
function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : [139, 92, 246]; // Default purple
}

export async function POST(request: NextRequest) {
  try {
    const reportData: GeneratedReport = await request.json();
    
    if (!reportData || !reportData.primary || !reportData.secondary) {
      return NextResponse.json(
        { error: 'Invalid report data provided' },
        { status: 400 }
      );
    }

    // Get archetype data
    const primaryArchetype = ARCHETYPE_DATA[reportData.primary as Archetype];
    const secondaryArchetype = ARCHETYPE_DATA[reportData.secondary as Archetype];
    const primaryColor = hexToRgb(primaryArchetype?.accentColor || '#8B5CF6');

    // Create PDF with dark background
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let currentPage = 1;

    // Helper function to add dark background
    const addDarkBackground = () => {
      doc.setFillColor(...DARK_BG);
      doc.rect(0, 0, pageWidth, pageHeight, 'F');
    };

    // Helper function to add footer
    const addFooter = (pageNum: number) => {
      doc.setTextColor(...GRAY_TEXT);
      doc.setFontSize(8);
      doc.text('archetype-protocol.vercel.app', 20, pageHeight - 15);
      if (pageNum > 1) {
        doc.text(`${pageNum}`, pageWidth - 20, pageHeight - 15, { align: 'right' });
      }
    };

    // Helper function to wrap text
    const wrapText = (text: string, maxWidth: number, fontSize: number = 12): string[] => {
      doc.setFontSize(fontSize);
      return doc.splitTextToSize(text, maxWidth);
    };

    // Cover Page
    addDarkBackground();
    
    // Protocol title
    doc.setTextColor(...GRAY_TEXT);
    doc.setFontSize(10);
    const protocolTitle = 'THE ARCHETYPE PROTOCOL';
    doc.text(protocolTitle, pageWidth / 2, 60, { align: 'center' });
    
    // Primary archetype name
    doc.setTextColor(...primaryColor);
    doc.setFontSize(32);
    doc.text(`THE ${reportData.primary.toUpperCase()}`, pageWidth / 2, 100, { align: 'center' });
    
    // Secondary archetype
    doc.setTextColor(...LIGHT_GRAY_TEXT);
    doc.setFontSize(18);
    doc.text(reportData.secondary, pageWidth / 2, 120, { align: 'center' });
    
    // Emoji
    doc.setTextColor(...WHITE_TEXT);
    doc.setFontSize(24);
    doc.text(primaryArchetype?.emoji || '✨', pageWidth / 2, 140, { align: 'center' });
    
    // Subtitle
    doc.setFontSize(14);
    doc.text('Your Complete Artist Blueprint', pageWidth / 2, 160, { align: 'center' });
    
    // Prepared for
    doc.setTextColor(...GRAY_TEXT);
    doc.setFontSize(10);
    doc.text('Prepared exclusively for You', pageWidth / 2, 180, { align: 'center' });
    
    // Date
    doc.setFontSize(8);
    const formattedDate = new Date(reportData.metadata.generatedAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    });
    doc.text(`Generated ${formattedDate}`, pageWidth / 2, pageHeight - 30, { align: 'center' });

    // Content Pages
    reportData.sections.forEach((section, sectionIndex) => {
      doc.addPage();
      currentPage++;
      addDarkBackground();
      
      // Accent line
      doc.setFillColor(...primaryColor);
      doc.rect(20, 0, 2, pageHeight, 'F');
      
      let yPos = 40;
      
      // Header
      doc.setTextColor(...GRAY_TEXT);
      doc.setFontSize(8);
      doc.text('THE ARCHETYPE PROTOCOL', 30, yPos);
      doc.text(`${sectionIndex + 1}`, pageWidth - 30, yPos, { align: 'right' });
      yPos += 20;
      
      // Section title
      doc.setTextColor(...primaryColor);
      doc.setFontSize(16);
      doc.text(section.title, 30, yPos);
      yPos += 25;
      
      // Pull quote if present
      if (section.pullQuote) {
        doc.setFillColor(26, 26, 26); // #1A1A1A
        doc.rect(30, yPos - 5, pageWidth - 60, 20, 'F');
        doc.setFillColor(...primaryColor);
        doc.rect(30, yPos - 5, 2, 20, 'F');
        
        doc.setTextColor(...WHITE_TEXT);
        doc.setFontSize(11);
        const quoteLines = wrapText(`"${section.pullQuote}"`, pageWidth - 80, 11);
        quoteLines.forEach((line, index) => {
          doc.text(line, 40, yPos + 5 + (index * 6));
        });
        yPos += 30;
      }
      
      // Section content
      doc.setTextColor(229, 229, 229); // #E5E5E5
      doc.setFontSize(10);
      
      const paragraphs = section.content.split('\n\n');
      paragraphs.forEach(paragraph => {
        if (paragraph.trim()) {
          const wrappedLines = wrapText(paragraph.trim(), pageWidth - 70, 10);
          wrappedLines.forEach(line => {
            if (yPos > pageHeight - 50) {
              // Start new page
              addFooter(currentPage);
              doc.addPage();
              currentPage++;
              addDarkBackground();
              
              // Accent line on new page
              doc.setFillColor(...primaryColor);
              doc.rect(20, 0, 2, pageHeight, 'F');
              yPos = 40;
              
              // Reset text color
              doc.setTextColor(229, 229, 229);
              doc.setFontSize(10);
            }
            doc.text(line, 30, yPos);
            yPos += 5;
          });
          yPos += 8; // Extra space between paragraphs
        }
      });
      
      addFooter(currentPage);
    });

    // Artist Manifesto Page (for Full tier)
    if (reportData.tier === 'full') {
      doc.addPage();
      currentPage++;
      addDarkBackground();
      
      // Center the content vertically
      let yPos = pageHeight / 2 - 60;
      
      // Title
      doc.setTextColor(...primaryColor);
      doc.setFontSize(24);
      doc.text('Your Artist Manifesto', pageWidth / 2, yPos, { align: 'center' });
      yPos += 40;
      
      // Manifesto content
      const manifesto = `I am the ${reportData.primary.toLowerCase()} who ${secondaryArchetype?.tagline || 'creates with purpose'}.\n\nMy art is my rebellion. My creativity is my magic. I do not seek permission to transform the world through my vision.\n\nI embrace both the structured power of ${reportData.primary} and the flowing energy of ${reportData.secondary}. This is my authentic creative identity.\n\nThe world needs what I have to offer. I will not dim my light or compromise my vision for anyone's comfort.\n\nThis is my artist manifesto. This is who I am.`;
      
      doc.setTextColor(...WHITE_TEXT);
      doc.setFontSize(12);
      const manifestoLines = wrapText(manifesto, pageWidth - 80, 12);
      manifestoLines.forEach(line => {
        doc.text(line, pageWidth / 2, yPos, { align: 'center' });
        yPos += 8;
      });
      
      // QR section placeholder
      yPos += 30;
      doc.setTextColor(...GRAY_TEXT);
      doc.setFontSize(8);
      doc.text('Visit archetype-protocol.vercel.app', pageWidth / 2, yPos, { align: 'center' });
      
      // QR code placeholder
      yPos += 15;
      doc.setFillColor(...WHITE_TEXT);
      doc.rect(pageWidth / 2 - 25, yPos, 50, 50, 'F');
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(8);
      doc.text('QR CODE', pageWidth / 2, yPos + 28, { align: 'center' });
    }

    // Generate PDF buffer
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
    
    // Generate filename
    const archetypeName = `${reportData.primary}-${reportData.secondary}`;
    const filename = `Archetype-Protocol-${archetypeName}-Blueprint.pdf`;

    // Return PDF as download
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });

  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate PDF', 
        detail: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ 
    status: 'PDF generation service online',
    timestamp: new Date().toISOString()
  });
}