import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Xtrackers Watchlist',
  description: 'Seguimiento de ETFs Xtrackers con precios en tiempo real de Yahoo Finance',
  themeColor: '#0F172A',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
