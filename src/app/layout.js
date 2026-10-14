import "./globals.css";

export const metadata = {
  title: "Data Penjualan 2-Stroke Surabaya | Pembukuan & Pelacak Modal",
  description: "Sistem pembukuan kas, kalkulasi profit, dan pelacak pinjaman modal jual beli motor 2-tak Surabaya (Belian Akbar)",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
