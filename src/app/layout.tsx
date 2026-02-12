import '@/app/globals.css';

import type { Metadata } from 'next';
import { Bebas_Neue, Geist, Geist_Mono } from 'next/font/google';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

/* Bebas Neue — Neo-Grotesque display font for headlines */
const bebasNeue = Bebas_Neue({
  weight: '400',
  variable: '--font-bebas-neue',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Vivek Kamani — Solo Video Editor',
  description:
    'I edit videos that capture attention. Sharp cuts, measurable results. Portfolio of Vivek Kamani.',
  metadataBase: new URL('https://vivekkamani.com'),
  openGraph: {
    title: 'Vivek Kamani — Solo Video Editor',
    description: 'I edit videos that capture attention.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${bebasNeue.variable} antialiased`}
      >
        {/* Skip link — AAA A11y */}
        <a href="#hero" className="skip-link">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
