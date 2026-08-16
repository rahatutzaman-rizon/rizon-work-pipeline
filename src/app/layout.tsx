import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import { ReactQueryProvider } from '@/components/providers/ReactQueryProvider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: 'Rizon Workspace — Personal Study, Knowledge & Task Platform',
  description:
    'A unified personal Study + Knowledge + Task Management workspace powered by AI agents and relational knowledge graphs.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${outfit.variable} font-sans bg-background text-foreground antialiased min-h-screen`}>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}
