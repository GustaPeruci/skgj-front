import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <title>Teclado Virtual</title>
      </head>
      <body className="bg-gray-100">
        {children}
      </body>
    </html>
  );
}
