import type React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { AlignRight, X, Instagram, Phone } from 'lucide-react';

import { Button } from '@/components/ui/button';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Отслеживаем скролл страницы для изменения стиля шапки
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Анимация для мобильного меню
  const menuVariants = {
    closed: {
      opacity: 0,
      x: "100%",
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  // Анимация для пунктов меню
  const menuItemVariants = {
    closed: { opacity: 0, y: 10 },
    open: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
        ease: "easeInOut"
      }
    })
  };

  // Список ссылок навигации
  const navLinks = [
    { title: 'Главная', path: '/' },
    { title: 'Услуги', path: '/services' },
    { title: 'Галерея', path: '/gallery' },
    { title: 'Отзывы', path: '/reviews' },
    { title: 'Контакты', path: '/contacts' },
  ];

  // Определяем классы для шапки в зависимости от скролла
  const headerClasses = `fixed top-0 w-full z-40 transition-all duration-300 ${
    isScrolled
      ? 'bg-white bg-opacity-90 backdrop-filter backdrop-blur-sm shadow-md py-3'
      : 'bg-transparent py-5'
  }`;

  return (
    <header className={headerClasses}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Логотип */}
          <Link href="/" className="flex items-center">
            <div className="relative h-12 w-12 bg-rose-100 rounded-full flex items-center justify-center mr-3">
              <div className="h-8 w-8 bg-rose-400 rounded-full flex items-center justify-center text-white text-lg font-semibold">
                N
              </div>
            </div>
            <div className="text-rose-900 font-semibold text-xl">
              NailMaster
            </div>
          </Link>

          {/* Десктопное меню */}
          <nav className="hidden md:flex space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className="text-rose-900 hover:text-rose-600 font-medium transition-colors"
              >
                {link.title}
              </Link>
            ))}
          </nav>

          {/* Кнопка записи и номер телефона */}
          <div className="hidden md:flex items-center space-x-5">
            <a href="tel:+71234567890" className="text-rose-900 font-medium flex items-center">
              <Phone className="w-4 h-4 mr-2" />
              +7 (123) 456-78-90
            </a>
            <Button asChild className="bg-rose-500 hover:bg-rose-600">
              <Link href="/appointment">Записаться</Link>
            </Button>
          </div>

          {/* Кнопка мобильного меню */}
          <button
            className="md:hidden text-rose-900 p-1"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Открыть меню"
          >
            <AlignRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Мобильное меню */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              className="absolute top-0 right-0 h-full w-4/5 max-w-sm bg-white p-5 shadow-xl"
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-10">
                <div className="text-xl font-semibold text-rose-900">Меню</div>
                <button
                  className="text-rose-900"
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Закрыть меню"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="flex flex-col space-y-6 mb-10">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.path}
                    custom={i}
                    variants={menuItemVariants}
                  >
                    <Link
                      href={link.path}
                      className="text-rose-900 hover:text-rose-600 font-medium text-lg transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.title}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <motion.div
                variants={menuItemVariants}
                custom={navLinks.length}
                className="mt-auto"
              >
                <Button asChild className="w-full bg-rose-500 hover:bg-rose-600 mb-4">
                  <Link href="/appointment" onClick={() => setIsMobileMenuOpen(false)}>
                    Записаться онлайн
                  </Link>
                </Button>
                <a
                  href="tel:+71234567890"
                  className="flex items-center justify-center text-rose-900 font-medium mb-6"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  +7 (123) 456-78-90
                </a>
              </motion.div>

              <motion.div
                className="border-t border-gray-200 pt-4 flex justify-center"
                variants={menuItemVariants}
                custom={navLinks.length + 1}
              >
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-rose-900 hover:text-rose-600 transition-colors"
                >
                  <Instagram className="w-6 h-6" />
                </a>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
