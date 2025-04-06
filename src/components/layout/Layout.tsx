import type React from 'react';
import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Preloader } from '@/components/shared/Preloader';
import { Toaster } from '@/components/ui/toaster';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);

  // Скрываем прелоадер после загрузки сайта
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Прелоадер при первой загрузке */}
      {isLoading && <Preloader />}

      {/* Тост-уведомления */}
      <Toaster />

      {/* Шапка */}
      <Header />

      {/* Основной контент */}
      <main className="min-h-screen pt-24">
        {children}
      </main>

      {/* Футер */}
      <Footer />
    </>
  );
};
