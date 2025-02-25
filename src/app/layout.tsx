import "./globals.css"; // Mantém o CSS global do Next.js

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-gray-100">
        {children}
      </body>
    </html>
  );
}
