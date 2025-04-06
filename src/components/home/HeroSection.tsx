'use client';

import type React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles, CalendarCheck, Award, Heart } from 'lucide-react';

export const HeroSection: React.FC = () => {
  // Анимация для элементов героя
  const heroVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: custom * 0.2,
        duration: 0.6,
        ease: "easeOut"
      }
    })
  };

  // Анимация для карточек преимуществ
  const featureVariants = {
    offscreen: { y: 50, opacity: 0 },
    onscreen: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        bounce: 0.4,
        delay: i * 0.1,
        duration: 0.8
      }
    })
  };

  // Данные для секции преимуществ
  const features = [
    {
      icon: <Sparkles className="h-10 w-10 text-rose-400" />,
      title: "Качественные материалы",
      description: "Использую только проверенные гипоаллергенные материалы премиум-класса для вашего здоровья и красоты."
    },
    {
      icon: <CalendarCheck className="h-10 w-10 text-rose-400" />,
      title: "Удобная запись",
      description: "Онлайн-запись 24/7 для вашего комфорта. Выберите удобное время и получите напоминание о процедуре."
    },
    {
      icon: <Award className="h-10 w-10 text-rose-400" />,
      title: "Профессионализм",
      description: "Сертифицированный мастер с многолетним опытом работы и постоянным повышением квалификации."
    },
    {
      icon: <Heart className="h-10 w-10 text-rose-400" />,
      title: "Индивидуальный подход",
      description: "Учитываю все ваши пожелания и особенности, чтобы результат превзошел ваши ожидания."
    }
  ];

  return (
    <>
      {/* Hero секция */}
      <section className="relative pt-20 pb-32 overflow-hidden bg-gradient-to-b from-rose-50 to-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            {/* Левая колонка с текстом */}
            <div className="w-full md:w-1/2 mb-10 md:mb-0 pr-0 md:pr-10">
              <motion.h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-rose-900 mb-6"
                variants={heroVariants}
                initial="hidden"
                animate="visible"
                custom={0}
              >
                Искусство <span className="text-rose-500">маникюра</span> в каждой детали
              </motion.h1>

              <motion.p
                className="text-lg text-gray-600 mb-8"
                variants={heroVariants}
                initial="hidden"
                animate="visible"
                custom={1}
              >
                Создаю уникальный дизайн ногтей, который подчеркнет вашу индивидуальность.
                Профессиональный подход, стерильные инструменты и премиальные материалы для
                идеального результата.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                variants={heroVariants}
                initial="hidden"
                animate="visible"
                custom={2}
              >
                <Button size="lg" asChild className="bg-rose-500 hover:bg-rose-600">
                  <Link href="/appointment">Записаться онлайн</Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="border-rose-300 text-rose-600 hover:bg-rose-50">
                  <Link href="/gallery">Смотреть работы</Link>
                </Button>
              </motion.div>
            </div>

            {/* Правая колонка с изображением */}
            <div className="w-full md:w-1/2 relative">
              <motion.div
                className="relative rounded-2xl overflow-hidden shadow-xl"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  transition: {
                    duration: 0.8,
                    ease: "easeOut"
                  }
                }}
              >
                {/* Коллаж из изображений маникюра */}
                <div className="grid grid-cols-2 gap-2 p-2 bg-white rounded-2xl">
                  <div className="col-span-2 h-48 relative rounded-xl overflow-hidden">
                    <Image
                      src="https://images.bauerhoffer.com/celebrity/sites/3/2023/04/Untitled-design-59.png?ar=16%3A9&fit=crop&crop=top&auto=format&w=1440&q=80"
                      alt="Стильный маникюр в розовых тонах"
                      fill
                      style={{ objectFit: 'cover', objectPosition: 'center' }}
                    />
                  </div>
                  <div className="h-40 relative rounded-xl overflow-hidden">
                    <Image
                      src="https://kiarasky.com/cdn/shop/articles/pretty-nail-design-cover_600x600_crop_center.jpg?v=1631575566"
                      alt="Нежный маникюр с градиентом"
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <div className="h-40 relative rounded-xl overflow-hidden">
                    <Image
                      src="https://www.shutterstock.com/image-photo/nail-design-manicure-gel-polish-600nw-2472803669.jpg"
                      alt="Элегантный черный маникюр"
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                </div>

                {/* Оверлей с текстом */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-rose-500/80 to-transparent p-4 text-white">
                  <p className="font-medium text-lg">Весенняя коллекция 2025</p>
                  <p className="text-sm">Модные тренды и актуальные дизайны</p>
                </div>
              </motion.div>

              {/* Изображение салона в маленьком круге */}
              <motion.div
                className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg z-10"
                initial={{ opacity: 0, scale: 0, rotate: -20 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  rotate: 0,
                  transition: {
                    delay: 0.5,
                    duration: 0.8,
                    ease: "backOut"
                  }
                }}
              >
                <Image
                  src="https://uniquekiosk.com/wp-content/uploads/2021/08/2-1.jpg"
                  alt="Элегантный интерьер салона"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </motion.div>

              {/* Декоративные элементы */}
              <motion.div
                className="absolute -bottom-10 -left-10 w-24 h-24 rounded-full bg-rose-200 z-0"
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: 0.6,
                  scale: 1,
                  transition: {
                    delay: 0.4,
                    duration: 0.8,
                    ease: "backOut"
                  }
                }}
              />
              <motion.div
                className="absolute -top-8 -right-8 w-16 h-16 rounded-full bg-rose-300 z-0"
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: 0.4,
                  scale: 1,
                  transition: {
                    delay: 0.6,
                    duration: 0.8,
                    ease: "backOut"
                  }
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Секция преимуществ */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center text-rose-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Почему выбирают меня
          </motion.h2>

          <motion.p
            className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Более 5 лет я создаю безупречный маникюр с заботой о здоровье и красоте ваших ногтей
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={`feature-${index}`}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                variants={featureVariants}
                initial="offscreen"
                whileInView="onscreen"
                viewport={{ once: true, amount: 0.3 }}
                custom={index}
              >
                <div className="bg-rose-50 w-16 h-16 rounded-lg flex items-center justify-center mb-5">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-rose-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
