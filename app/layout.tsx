import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ThemeProvider } from '@/components/ThemeProvider';
import { SoundEffects } from '@/components/SoundEffects';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Lonorix CR - Optimize your Clash Royale journey',
  description: 'AI-powered Clash Royale deck coaching and card planning tool',
  icons: {
    icon: '/crlogo.png',
    shortcut: '/crlogo.png',
    apple: '/crlogo.png',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen dark-gradient-bg">
            <SoundEffects />
            <Navbar />
              <main className="pt-16">
              {children}
            </main>
            <Footer />
            <Toaster 
              position="top-right" 
              richColors 
              closeButton
              toastOptions={{
                style: {
                  background: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  color: 'hsl(var(--foreground))',
                },
              }}
            />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}