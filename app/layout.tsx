import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import TanStackProvider from '@/components/TanStackProvider/TanStackProvider';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import 'modern-normalize/modern-normalize.css';
import './globals.css';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-roboto',
});

export const metadata: Metadata = {
  title: 'NoteHub - Ефективне управління нотатками',
  description:
    'NoteHub - це простий та ефективний додаток для управління особистими нотатками. Організовуйте свої думки в одному місці.',
  openGraph: {
    title: 'NoteHub - Ефективне управління нотатками',
    description:
      'NoteHub - це простий та ефективний додаток для управління особистими нотатками. Організовуйте свої думки в одному місці.',
    url: 'https://notehub-app.com',
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'NoteHub App',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NoteHub - Ефективне управління нотатками',
    description:
      'NoteHub - це простий та ефективний додаток для управління особистими нотатками.',
    images: ['https://ac.goit.global/fullstack/react/notehub-og-meta.jpg'],
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
  modal: React.ReactNode;
}

export default function RootLayout({ children, modal }: RootLayoutProps) {
  return (
    <html lang="uk" className={roboto.variable}>
      <body className={roboto.className}>
        <TanStackProvider>
          <Header />
          <main>
            {children}
            {modal}
          </main>
          <Footer />
        </TanStackProvider>
      </body>
    </html>
  );
}
