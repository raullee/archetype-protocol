import { ARCHETYPE_DATA, Archetype } from '@/lib/archetypes';

interface ReportSection {
  title: string;
  content: string;
  pullQuote?: string;
}

interface ReportRenderProps {
  searchParams: Promise<{
    primary?: string;
    secondary?: string;
    tier?: string;
    data?: string;
  }>;
}

export default async function ReportRenderPage({ searchParams }: ReportRenderProps) {
  const params = await searchParams;
  const primary = (params.primary || 'Magician') as Archetype;
  const secondary = (params.secondary || 'Creator') as Archetype;
  const tier = params.tier || 'full';

  let sections: ReportSection[] = [];
  if (params.data) {
    try {
      sections = JSON.parse(Buffer.from(params.data, 'base64').toString('utf-8'));
    } catch {
      sections = [];
    }
  }

  const primaryData = ARCHETYPE_DATA[primary] || ARCHETYPE_DATA.Magician;
  const secondaryData = ARCHETYPE_DATA[secondary] || ARCHETYPE_DATA.Creator;

  const generatedDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div
      style={{
        fontFamily: "'Inter', sans-serif",
        background: '#050505',
        color: '#EBEBEB',
        minHeight: '100vh',
        margin: 0,
        padding: 0,
      }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @import url('https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,200;1,300;1,400;1,500;1,600;1,700;1,800&family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&display=swap');

            * { margin: 0; padding: 0; box-sizing: border-box; }

            body {
              font-family: 'Inter', sans-serif;
              background: #050505;
              color: #EBEBEB;
              -webkit-font-smoothing: antialiased;
            }

            .serif { font-family: 'Newsreader', serif; }
            .tech-label {
              font-family: 'Space Grotesk', monospace;
              text-transform: uppercase;
              letter-spacing: 0.2em;
              font-size: 10px;
            }

            .cover-page {
              min-height: 100vh;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              text-align: center;
              padding: 60px 40px;
              position: relative;
              overflow: hidden;
            }

            .cover-page::before {
              content: '';
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 600px;
              height: 600px;
              background: radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%);
              border-radius: 50%;
              pointer-events: none;
            }

            .cover-protocol {
              font-family: 'Space Grotesk', monospace;
              font-size: 10px;
              letter-spacing: 0.2em;
              text-transform: uppercase;
              color: rgba(255,255,255,0.4);
              margin-bottom: 40px;
              position: relative;
            }

            .cover-emoji {
              font-size: 64px;
              margin-bottom: 24px;
              position: relative;
            }

            .cover-title {
              font-family: 'Newsreader', serif;
              font-size: 56px;
              font-weight: 300;
              letter-spacing: -0.04em;
              color: #10B981;
              margin-bottom: 12px;
              position: relative;
            }

            .cover-secondary {
              font-family: 'Newsreader', serif;
              font-size: 20px;
              font-style: italic;
              color: rgba(255,255,255,0.4);
              margin-bottom: 32px;
              position: relative;
            }

            .badge-row {
              display: flex;
              gap: 12px;
              justify-content: center;
              align-items: center;
              flex-wrap: wrap;
              margin-bottom: 24px;
              position: relative;
            }

            .badge {
              padding: 8px 20px;
              border-radius: 999px;
              font-size: 14px;
              font-weight: 500;
              border: 1px solid rgba(16,185,129,0.2);
              background: rgba(16,185,129,0.05);
              color: #10B981;
            }

            .badge-secondary {
              border-color: rgba(255,255,255,0.1);
              background: rgba(255,255,255,0.02);
              color: rgba(255,255,255,0.5);
            }

            .cover-tagline {
              font-family: 'Newsreader', serif;
              font-size: 18px;
              font-style: italic;
              color: rgba(255,255,255,0.4);
              max-width: 500px;
              line-height: 1.6;
              position: relative;
            }

            .cover-date {
              position: absolute;
              bottom: 40px;
              font-family: 'Space Grotesk', monospace;
              font-size: 10px;
              letter-spacing: 0.2em;
              text-transform: uppercase;
              color: rgba(255,255,255,0.2);
            }

            .glass-section {
              background: rgba(255, 255, 255, 0.02);
              backdrop-filter: blur(12px);
              border: 1px solid rgba(255, 255, 255, 0.1);
              border-radius: 24px;
              padding: 48px;
              margin: 0 auto 40px;
              max-width: 800px;
              position: relative;
            }

            .glass-section::before {
              content: '';
              position: absolute;
              left: 0;
              top: 0;
              bottom: 0;
              width: 2px;
              background: #10B981;
              border-radius: 2px 0 0 2px;
            }

            .section-number {
              font-family: 'Space Grotesk', monospace;
              font-size: 10px;
              letter-spacing: 0.2em;
              text-transform: uppercase;
              color: rgba(255,255,255,0.3);
              margin-bottom: 12px;
            }

            .section-title {
              font-family: 'Newsreader', serif;
              font-size: 28px;
              font-weight: 300;
              letter-spacing: -0.03em;
              color: #EBEBEB;
              margin-bottom: 24px;
            }

            .pull-quote {
              background: rgba(16,185,129,0.05);
              border-left: 2px solid #10B981;
              padding: 20px 28px;
              border-radius: 0 24px 24px 0;
              margin: 24px 0;
              font-family: 'Newsreader', serif;
              font-size: 18px;
              font-style: italic;
              color: #10B981;
              line-height: 1.6;
            }

            .section-content {
              font-family: 'Inter', sans-serif;
              font-size: 16px;
              line-height: 1.8;
              color: rgba(255,255,255,0.5);
            }

            .section-content p {
              margin-bottom: 16px;
            }

            .section-content strong {
              color: #EBEBEB;
              font-weight: 600;
            }

            .section-content em {
              font-style: italic;
              color: rgba(255,255,255,0.4);
            }

            .manifesto-section {
              text-align: center;
              min-height: 80vh;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              padding: 80px 48px;
              background: rgba(255,255,255,0.02);
            }

            .manifesto-section .section-title {
              font-size: 36px;
              margin-bottom: 40px;
              color: #10B981;
            }

            .manifesto-section .section-content {
              font-family: 'Newsreader', serif;
              font-size: 20px;
              font-style: italic;
              line-height: 2;
              max-width: 600px;
              color: rgba(255,255,255,0.6);
            }

            .compatibility-bar {
              height: 4px;
              background: rgba(255, 255, 255, 0.06);
              border-radius: 999px;
              overflow: hidden;
              margin-top: 8px;
            }

            .compatibility-fill {
              height: 100%;
              border-radius: 999px;
              background: #10B981;
            }

            .compatibility-matrix {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 16px;
              margin: 24px 0;
            }

            .compat-item {
              background: rgba(255, 255, 255, 0.02);
              border: 1px solid rgba(255,255,255,0.1);
              border-radius: 24px;
              padding: 16px;
            }

            .compat-label {
              font-family: 'Space Grotesk', monospace;
              font-size: 10px;
              letter-spacing: 0.2em;
              text-transform: uppercase;
              color: rgba(255,255,255,0.3);
              margin-bottom: 8px;
            }

            .compat-score {
              font-family: 'Newsreader', serif;
              font-size: 24px;
              font-weight: 300;
              color: #10B981;
            }

            .report-footer {
              text-align: center;
              padding: 60px 40px;
              border-top: 1px solid rgba(255, 255, 255, 0.1);
              margin-top: 40px;
            }

            .report-footer-logo {
              font-family: 'Newsreader', serif;
              font-size: 16px;
              letter-spacing: -0.02em;
              color: rgba(255,255,255,0.3);
              margin-bottom: 8px;
            }

            .report-footer-url {
              font-family: 'Space Grotesk', monospace;
              font-size: 10px;
              letter-spacing: 0.2em;
              text-transform: uppercase;
              color: rgba(255,255,255,0.2);
            }

            @media print {
              .cover-page {
                page-break-after: always;
              }

              .glass-section {
                page-break-inside: avoid;
                break-inside: avoid;
              }

              .manifesto-section {
                page-break-before: always;
              }

              .report-footer {
                page-break-before: always;
              }

              body {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
              }
            }
          `,
        }}
      />

      {/* Cover Page */}
      <div className="cover-page">
        <div className="cover-protocol">THE ARCHETYPE PROTOCOL</div>
        <div className="cover-emoji">{primaryData.emoji}</div>
        <h1 className="cover-title">THE {primary.toUpperCase()}</h1>
        <div className="cover-secondary">{secondary}</div>
        <div className="badge-row">
          <span className="badge">
            {primaryData.emoji} {primary}
          </span>
          <span className="badge badge-secondary">
            {secondaryData.emoji} {secondary}
          </span>
        </div>
        <p className="cover-tagline">&ldquo;{primaryData.tagline}&rdquo;</p>
        <div className="cover-date">Generated {generatedDate}</div>
      </div>

      {/* Report Sections */}
      <div style={{ padding: '20px 24px' }}>
        {sections.map((section, index) => {
          const isManifesto =
            tier === 'full' &&
            (section.title.toLowerCase().includes('manifesto') ||
              section.title.toLowerCase().includes('declaration'));

          if (isManifesto) {
            return (
              <div key={index} className="glass-section manifesto-section">
                <div className="section-number">YOUR DECLARATION</div>
                <h2 className="section-title">{section.title}</h2>
                <div
                  className="section-content"
                  dangerouslySetInnerHTML={{
                    __html: formatContent(section.content),
                  }}
                />
              </div>
            );
          }

          return (
            <div
              key={index}
              className="glass-section"
            >
              <div className="section-number">
                SECTION {index + 1} OF {sections.length}
              </div>
              <h2 className="section-title">
                {section.title}
              </h2>
              {section.pullQuote && (
                <div className="pull-quote">
                  &ldquo;{section.pullQuote}&rdquo;
                </div>
              )}
              <div
                className="section-content"
                dangerouslySetInnerHTML={{
                  __html: formatContent(section.content),
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="report-footer">
        <div style={{ fontSize: '32px', marginBottom: '12px' }}>{primaryData.emoji}</div>
        <div className="report-footer-logo">The Archetype Protocol</div>
        <div className="report-footer-url">archetype-protocol.vercel.app</div>
      </div>
    </div>
  );
}

function formatContent(content: string): string {
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
    .replace(/^/, '<p>')
    .replace(/$/, '</p>');
}
