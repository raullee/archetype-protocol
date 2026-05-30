export default function ReportRenderLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: '#0A0A0B' }}>
        {children}
      </body>
    </html>
  );
}
