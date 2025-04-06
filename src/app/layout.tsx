import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/app/globals.css';
import { ClientBody } from './ClientBody';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata: Metadata = {
  title: 'NailMaster - Профессиональный маникюр и дизайн ногтей',
  description: 'Салон красоты предлагает услуги маникюра, педикюра и дизайна ногтей от профессионального мастера. Запись онлайн и галерея работ.',
  keywords: 'маникюр, педикюр, дизайн ногтей, салон красоты, маникюрный салон',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <ClientBody>
          {children}
        </ClientBody>
      </body>
    </html>
  );
}
