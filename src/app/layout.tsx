// src/app/layout.tsx

import type { Metadata } from 'next';
import { 
  Cinzel, 
  Cinzel_Decorative, 
  Merriweather, 
  Merriweather_Sans 
} from 'next/font/google';
import './globals.css';

// Configuration des polices Google Fonts
const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  display: 'swap',
});

const cinzelDecorative = Cinzel_Decorative({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-cinzel-decorative',
  display: 'swap',
});

const merriweather = Merriweather({
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
  variable: '--font-merriweather',
  display: 'swap',
});

const merriweatherSans = Merriweather_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-merriweather-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Immers'Write - Write stories beyond words",
  description: 'Plateforme d\'écriture et de lecture immersive et interactive',
  keywords: ['écriture', 'lecture', 'immersif', 'fantasy', 'sci-fi', 'multimédia'],
  authors: [{ name: 'Laure Lavie' }],
  openGraph: {
    title: "Immers'Write",
    description: 'Write stories beyond words',
    type: 'website',
    locale: 'fr_FR',
    siteName: "Immers'Write",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`
          ${cinzel.variable} 
          ${cinzelDecorative.variable} 
          ${merriweather.variable} 
          ${merriweatherSans.variable}
          font-merriweather-sans
          antialiased
        `}
      >
        {children}
      </body>
    </html>
  );
}