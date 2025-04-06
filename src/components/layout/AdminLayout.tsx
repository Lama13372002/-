'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/auth/AuthContext';
import {
  LayoutDashboard,
  Scissors,
  Image,
  Calendar,
  MessageSquare,
  Settings,
  LogOut,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();
  const { toast } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Проверка авторизации
  useEffect(() => {
    if (!isAuthenticated && pathname !== '/admin') {
      router.push('/admin');
    }
  }, [isAuthenticated, pathname, router]);

  // Список пунктов меню
  const navItems: NavItem[] = [
    {
      label: 'Дашборд',
      href: '/admin/dashboard',
      icon: <LayoutDashboard size={20} />,
    },
    {
      label: 'Услуги',
      href: '/admin/services',
      icon: <Scissors size={20} />,
    },
    {
      label: 'Галерея',
      href: '/admin/gallery',
      icon: <Image size={20} />,
    },
    {
      label: 'Записи',
      href: '/admin/appointments',
      icon: <Calendar size={20} />,
    },
    {
      label: 'Отзывы',
      href: '/admin/reviews',
      icon: <MessageSquare size={20} />,
    },
    {
      label: 'Настройки',
      href: '/admin/settings',
      icon: <Settings size={20} />,
    },
  ];

  // Обработчик выхода
  const handleLogout = () => {
    logout();
    toast({
      title: 'Выход выполнен',
      description: 'Вы успешно вышли из системы',
    });
    router.push('/admin');
  };

  // Показывать только если аутентифицирован и не на странице логина
  if (!isAuthenticated && pathname !== '/admin/dashboard') {
    return null;
  }

  // Если мы на странице логина, просто отрисовываем дочерние элементы без макета
  if (pathname === '/admin') {
    return <>{children}</>;
  }

  // Анимация для мобильного меню
  const menuVariants = {
    closed: {
      x: '-100%',
      opacity: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
    open: {
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    closed: { x: -20, opacity: 0 },
    open: { x: 0, opacity: 1 },
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-rose-50">
      {/* Мобильная шапка */}
      <div className="lg:hidden bg-white shadow-sm p-4 flex items-center justify-between z-10">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center mr-3">
            <div className="w-7 h-7 rounded-full bg-rose-400 flex items-center justify-center text-white text-xs font-semibold">
              N
            </div>
          </div>
          <h1 className="text-lg font-semibold text-rose-700">Админ-панель</h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-rose-600"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>

      {/* Мобильное меню с анимацией */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              className="bg-white w-2/3 h-full p-6 overflow-y-auto"
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col space-y-6">
                {navItems.map((item) => (
                  <motion.div key={item.href} variants={itemVariants}>
                    <Link
                      href={item.href}
                      className={`flex items-center p-3 rounded-md ${
                        pathname === item.href
                          ? 'bg-rose-100 text-rose-700'
                          : 'text-gray-600 hover:bg-rose-50'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.icon}
                      <span className="ml-3">{item.label}</span>
                    </Link>
                  </motion.div>
                ))}
                <Separator />
                <motion.div variants={itemVariants}>
                  <button
                    onClick={handleLogout}
                    className="flex items-center p-3 rounded-md text-gray-600 hover:bg-rose-50 w-full"
                  >
                    <LogOut size={20} />
                    <span className="ml-3">Выход</span>
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Боковая панель для десктопа */}
      <div className="hidden lg:flex lg:flex-col w-64 bg-white shadow-md p-6 z-10">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
            <div className="w-7 h-7 rounded-full bg-rose-400 flex items-center justify-center text-white text-xs font-semibold">
              N
            </div>
          </div>
          <h1 className="text-xl font-semibold text-rose-700">Админ-панель</h1>
        </div>

        <div className="flex flex-col flex-grow space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center p-3 rounded-md transition-colors ${
                pathname === item.href
                  ? 'bg-rose-100 text-rose-700'
                  : 'text-gray-600 hover:bg-rose-50'
              }`}
            >
              {item.icon}
              <span className="ml-3">{item.label}</span>
              {pathname === item.href && (
                <ChevronRight size={16} className="ml-auto text-rose-700" />
              )}
            </Link>
          ))}
        </div>

        <Separator className="my-4" />

        <button
          onClick={handleLogout}
          className="flex items-center p-3 rounded-md text-gray-600 hover:bg-rose-50 w-full"
        >
          <LogOut size={20} />
          <span className="ml-3">Выход</span>
        </button>
      </div>

      {/* Основное содержимое */}
      <main className="flex-grow p-4 lg:p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
};
