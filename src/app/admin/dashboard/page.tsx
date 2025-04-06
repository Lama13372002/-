'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  CalendarCheck,
  UserCircle2,
  MessagesSquare,
  Scissors,
  TrendingUp,
  Clock,
  Users,
  ExternalLink
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface StatCard {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  color: string;
  link: string;
}

export default function Dashboard() {
  const [statsLoaded, setStatsLoaded] = useState(false);

  useEffect(() => {
    // Имитация загрузки данных с сервера
    const timer = setTimeout(() => {
      setStatsLoaded(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Карточки со статистикой
  const statCards: StatCard[] = [
    {
      title: 'Записи',
      value: 24,
      description: '6 новых за сегодня',
      icon: <CalendarCheck className="text-blue-500" size={24} />,
      color: 'bg-blue-50 border-blue-200',
      link: '/admin/appointments'
    },
    {
      title: 'Услуги',
      value: 18,
      description: '3 популярные',
      icon: <Scissors className="text-purple-500" size={24} />,
      color: 'bg-purple-50 border-purple-200',
      link: '/admin/services'
    },
    {
      title: 'Работы',
      value: 56,
      description: '12 новых в галерее',
      icon: <TrendingUp className="text-emerald-500" size={24} />,
      color: 'bg-emerald-50 border-emerald-200',
      link: '/admin/gallery'
    },
    {
      title: 'Отзывы',
      value: 32,
      description: '4 ожидают модерации',
      icon: <MessagesSquare className="text-amber-500" size={24} />,
      color: 'bg-amber-50 border-amber-200',
      link: '/admin/reviews'
    }
  ];

  // Анимации
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-rose-700">Дашборд</h1>
        <p className="text-sm text-gray-500">Последнее обновление: {new Date().toLocaleString('ru-RU')}</p>
      </div>

      {/* Карточки со статистикой */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={container}
        initial="hidden"
        animate={statsLoaded ? "show" : "hidden"}
      >
        {statCards.map((card, index) => (
          <motion.div key={index} variants={item}>
            <Link href={card.link}>
              <Card className={`border hover:shadow-md transition-all ${card.color} h-full`}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-medium">{card.title}</CardTitle>
                  {card.icon}
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{card.value}</div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground pt-1">{card.description}</p>
                    <ExternalLink size={14} className="text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Табы с данными */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: statsLoaded ? 1 : 0, y: statsLoaded ? 0 : 20 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="upcoming">Предстоящие записи</TabsTrigger>
            <TabsTrigger value="recent">Недавние отзывы</TabsTrigger>
            <TabsTrigger value="popular">Популярные услуги</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="bg-white p-6 rounded-lg border">
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <h3 className="font-medium">Ближайшие записи клиентов</h3>
                <Link href="/admin/appointments" className="text-rose-600 hover:underline text-sm flex items-center">
                  Все записи <ExternalLink size={12} className="ml-1" />
                </Link>
              </div>

              <div className="space-y-3">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center">
                      <UserCircle2 className="mr-3 text-gray-400" size={20} />
                      <div>
                        <p className="font-medium text-sm">Анна Иванова</p>
                        <p className="text-xs text-gray-500">Маникюр с покрытием</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Clock size={14} className="mr-1 text-gray-400" />
                      <span className="text-sm">Сегодня, 15:00</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="recent" className="bg-white p-6 rounded-lg border">
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <h3 className="font-medium">Последние отзывы клиентов</h3>
                <Link href="/admin/reviews" className="text-rose-600 hover:underline text-sm flex items-center">
                  Все отзывы <ExternalLink size={12} className="ml-1" />
                </Link>
              </div>

              <div className="space-y-3">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center mb-2">
                      <UserCircle2 className="mr-2 text-gray-400" size={20} />
                      <p className="font-medium text-sm">Мария Петрова</p>
                      <div className="ml-auto flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star} className="text-amber-400 text-xs">★</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">Отличный мастер! Очень довольна результатом, буду обращаться еще.</p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="popular" className="bg-white p-6 rounded-lg border">
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <h3 className="font-medium">Самые популярные услуги</h3>
                <Link href="/admin/services" className="text-rose-600 hover:underline text-sm flex items-center">
                  Все услуги <ExternalLink size={12} className="ml-1" />
                </Link>
              </div>

              <div className="space-y-3">
                {[
                  { name: 'Маникюр с гель-лаком', count: 42, price: '1500 ₽' },
                  { name: 'Наращивание ногтей', count: 28, price: '2300 ₽' },
                  { name: 'Педикюр', count: 19, price: '1800 ₽' }
                ].map((service, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div>
                      <p className="font-medium text-sm">{service.name}</p>
                      <p className="text-xs text-gray-500">Цена: {service.price}</p>
                    </div>
                    <div className="flex items-center bg-rose-100 px-2 py-1 rounded text-xs text-rose-700">
                      <Users size={12} className="mr-1" />
                      <span>{service.count} записей</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
