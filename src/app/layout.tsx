import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { CalibrationProvider } from '@/context/CalibrationContext';
import { SoundProvider } from '@/context/SoundContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Wait, How Fast Is That? | Digital Museum of Speed, Latency & Scale',
  description:
    'An interactive digital museum that calibrates to your physical monitor inches: feel 1:1 true-scale speed, experience real network lag from nerves to Voyager 1, and watch 1 Gigabit pour as physical matter.',
  keywords: [
    'speed museum',
    'latency arcade',
    'screen calibration',
    'bits vs bytes',
    'CPU time dilation',
    'true scale speed',
    'interactive science',
    'Grace Hopper nanosecond',
    'Starlink latency',
  ],
  authors: [{ name: 'Wait, How Fast Is That? Museum Curator' }],
  openGraph: {
    title: 'Wait, How Fast Is That? | Interactive Digital Museum',
    description:
      'Calibrates to your physical screen inches: experience true-scale physical speed, feel ping delays across space, and visualize 1 Gigabit as 3.6 tons of rice per second.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Wait, How Fast Is That?',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wait, How Fast Is That? | Digital Museum of Speed',
    description:
      'Calibrated to your screen inches: 1:1 real-world speed, network delay simulator, and physical data volume visualizer.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#f5f7fb] text-slate-900 selection:bg-indigo-500/20 selection:text-indigo-900">
        <CalibrationProvider>
          <SoundProvider>
            <Navbar />
            <main className="flex-1 w-full">{children}</main>
            <Footer />
          </SoundProvider>
        </CalibrationProvider>
      </body>
    </html>
  );
}
