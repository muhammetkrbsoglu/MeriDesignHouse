import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ToastProvider } from '@/components/ToastProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'MeriDesignHouse - Özel Gün Tasarım Hediyeleri',
  description: 'Düğün, kına ve özel günleriniz için tasarım hediyeleri. Etkinlik konsept tasarımcısı ve tasarım atölyesi ile kişiselleştirilmiş ürünler.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="tr">
        <body className="bg-primary-background text-primary-text">
          <ToastProvider>
            <Header />
            <main>
              {children}
            </main>
            <Footer />
          </ToastProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
