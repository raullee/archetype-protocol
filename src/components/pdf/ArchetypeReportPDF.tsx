import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
} from '@react-pdf/renderer';
import { ARCHETYPE_DATA, Archetype } from '@/lib/archetypes';

// Use built-in fonts for reliability

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

interface ArchetypeReportPDFProps {
  report: GeneratedReport;
}

// Premium styles with dark theme
const styles = StyleSheet.create({
  page: {
    backgroundColor: '#0A0A0B',
    fontFamily: 'Helvetica',
    fontSize: 12,
    lineHeight: 1.6,
    paddingTop: 0,
    paddingBottom: 0,
    paddingHorizontal: 0,
  },
  coverPage: {
    backgroundColor: '#0A0A0B',
    color: '#FFFFFF',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 60,
    paddingVertical: 80,
  },
  protocolTitle: {
    fontSize: 14,
    fontWeight: 'light',
    letterSpacing: 4,
    marginBottom: 60,
    textAlign: 'center',
    color: '#888888',
  },
  archetypeName: {
    fontSize: 48,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  secondaryArchetype: {
    fontSize: 24,
    fontWeight: 'normal',
    textAlign: 'center',
    marginBottom: 40,
    color: '#CCCCCC',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'normal',
    textAlign: 'center',
    marginBottom: 30,
    color: '#FFFFFF',
  },
  preparedFor: {
    fontSize: 12,
    fontWeight: 'light',
    textAlign: 'center',
    marginBottom: 40,
    color: '#888888',
  },
  emoji: {
    fontSize: 40,
    textAlign: 'center',
    marginBottom: 30,
  },
  date: {
    position: 'absolute',
    bottom: 40,
    fontSize: 10,
    color: '#666666',
  },
  contentPage: {
    backgroundColor: '#0A0A0B',
    color: '#FFFFFF',
    paddingTop: 60,
    paddingBottom: 60,
    paddingHorizontal: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 20,
    marginBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  headerTitle: {
    fontSize: 10,
    fontWeight: 'light',
    color: '#888888',
    letterSpacing: 2,
  },
  pageNumber: {
    fontSize: 10,
    color: '#666666',
  },
  accentLine: {
    width: 4,
    height: '100%',
    position: 'absolute',
    left: 40,
    top: 0,
  },
  content: {
    marginLeft: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 15,
    paddingBottom: 5,
  },
  sectionContent: {
    fontSize: 11,
    lineHeight: 1.7,
    marginBottom: 20,
    color: '#E5E5E5',
  },
  pullQuote: {
    backgroundColor: '#1A1A1A',
    padding: 20,
    marginVertical: 20,
    borderLeftWidth: 4,
    fontSize: 13,
    fontStyle: 'italic',
    color: '#FFFFFF',
  },
  paragraph: {
    marginBottom: 12,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 60,
    right: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  watermark: {
    fontSize: 8,
    color: '#444444',
  },
  manifestoPage: {
    backgroundColor: '#0A0A0B',
    color: '#FFFFFF',
    paddingVertical: 80,
    paddingHorizontal: 60,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  manifestoTitle: {
    fontSize: 32,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 40,
    textAlign: 'center',
  },
  manifestoContent: {
    fontSize: 14,
    lineHeight: 2,
    marginBottom: 40,
    textAlign: 'center',
    maxWidth: 400,
  },
  qrSection: {
    marginTop: 60,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  qrText: {
    fontSize: 10,
    color: '#888888',
    marginBottom: 10,
  },
});

export const ArchetypeReportPDF: React.FC<ArchetypeReportPDFProps> = ({ report }) => {
  const primaryArchetype = ARCHETYPE_DATA[report.primary as Archetype];
  const secondaryArchetype = ARCHETYPE_DATA[report.secondary as Archetype];
  const primaryColor = primaryArchetype?.accentColor || '#8B5CF6';
  const secondaryColor = secondaryArchetype?.accentColor || '#64748B';

  // Generate manifesto content for full tier
  const generateManifesto = (primary: string, secondary: string) => {
    const manifest = `I am the ${primary.toLowerCase()} who ${secondaryArchetype?.tagline || 'creates with purpose'}. 
    
My art is my rebellion. My creativity is my magic. I do not seek permission to transform the world through my vision.

I embrace both the structured power of ${primary} and the flowing energy of ${secondary}. This is my authentic creative identity.

The world needs what I have to offer. I will not dim my light or compromise my vision for anyone's comfort.

This is my artist manifesto. This is who I am.`;
    
    return manifest;
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatContent = (content: string) => {
    return content.split('\n\n').map((paragraph, index) => (
      <Text key={index} style={styles.paragraph}>
        {paragraph.trim()}
      </Text>
    ));
  };

  return (
    <Document>
      {/* Cover Page */}
      <Page style={styles.page}>
        <View style={styles.coverPage}>
          <Text style={styles.protocolTitle}>THE ARCHETYPE PROTOCOL</Text>
          
          <Text style={[styles.archetypeName, { color: primaryColor }]}>
            THE {report.primary.toUpperCase()}
          </Text>
          
          <Text style={styles.secondaryArchetype}>{report.secondary}</Text>
          
          <Text style={styles.emoji}>{primaryArchetype?.emoji}</Text>
          
          <Text style={styles.subtitle}>Your Complete Artist Blueprint</Text>
          
          <Text style={styles.preparedFor}>
            Prepared exclusively for You
          </Text>
          
          <Text style={styles.date}>
            Generated {formatDate(report.metadata.generatedAt)}
          </Text>
        </View>
      </Page>

      {/* Content Pages */}
      {report.sections.map((section, sectionIndex) => (
        <Page key={sectionIndex} style={styles.page}>
          <View style={styles.contentPage}>
            {/* Accent line */}
            <View style={[styles.accentLine, { backgroundColor: primaryColor }]} />
            
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>THE ARCHETYPE PROTOCOL</Text>
              <Text style={styles.pageNumber}>{sectionIndex + 1}</Text>
            </View>
            
            {/* Content */}
            <View style={styles.content}>
              <Text style={[styles.sectionTitle, { color: primaryColor }]}>
                {section.title}
              </Text>
              
              {section.pullQuote && (
                <View style={[styles.pullQuote, { borderLeftColor: primaryColor }]}>
                  <Text>"{section.pullQuote}"</Text>
                </View>
              )}
              
              <View style={styles.sectionContent}>
                {formatContent(section.content)}
              </View>
            </View>
            
            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.watermark}>archetype-protocol.vercel.app</Text>
              <Text style={styles.pageNumber}>{sectionIndex + 1}</Text>
            </View>
          </View>
        </Page>
      ))}

      {/* Artist Manifesto Page (for Full tier) */}
      {report.tier === 'full' && (
        <Page style={styles.page}>
          <View style={styles.manifestoPage}>
            <Text style={[styles.manifestoTitle, { color: primaryColor }]}>
              Your Artist Manifesto
            </Text>
            
            <Text style={styles.manifestoContent}>
              {generateManifesto(report.primary, report.secondary)}
            </Text>
            
            <View style={styles.qrSection}>
              <Text style={styles.qrText}>
                Visit archetype-protocol.vercel.app
              </Text>
              {/* QR code would go here - placeholder for now */}
              <View style={{
                width: 100,
                height: 100,
                backgroundColor: '#FFFFFF',
                marginTop: 10,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <Text style={{ color: '#000000', fontSize: 8 }}>QR CODE</Text>
              </View>
            </View>
          </View>
        </Page>
      )}
    </Document>
  );
};