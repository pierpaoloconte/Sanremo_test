import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sanremo Voting Room',
  description: 'Web app per votare i cantanti del Festival di Sanremo'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
