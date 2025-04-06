'use client';

import type React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Sparkles,
  ScrollText,
  Clock,
  CheckCircle2
} from 'lucide-react';

// Данные о мастере (в реальном приложении получаем из БД)
const masterData = {
  name: 'Анна Смирнова',
  imageUrl: '',
  experience: '5+ лет',
  education: [
    'Сертифицированный мастер ногтевого сервиса',
    'Курс "Дизайн ногтей: от простого к сложному", 2022',
    'Курс "Аппаратный маникюр", 2021',
    'Диплом мастера маникюра и педикюра, 2020'
  ],
  achievements: [
    'Участник международной выставки IndústryNail 2023',
    'Призер конкурса нейл-дизайна "Стильный образ", 2022',
    'Создатель авторской техники "Мраморный эффект"'
  ]
};

export const MasterInfo: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Фото мастера */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="rounded-xl overflow-hidden shadow-xl">
              {masterData.imageUrl ? (
                <Image
                  src={masterData.imageUrl}
                  alt={masterData.name}
                  width={600}
                  height={700}
                  className="object-cover w-full h-[500px]"
                />
              ) : (
                <div className="relative w-full h-[500px] bg-rose-100 flex items-center justify-center">
                  <span className="text-rose-500 text-xl">Фото мастера</span>
                </div>
              )}
            </div>

            {/* Декоративные элементы */}
            <motion.div
              className="absolute -bottom-8 -left-8 w-40 h-40 bg-rose-100 rounded-full -z-10"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
            />
            <motion.div
              className="absolute -top-8 -right-8 w-24 h-24 bg-rose-200 rounded-full -z-10"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.5 }}
            />
          </motion.div>

          {/* Информация о мастере */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-rose-900 mb-6">
              Ваш мастер маникюра
            </h2>

            <h3 className="text-2xl font-bold text-rose-700 mb-4">
              {masterData.name}
            </h3>

            <div className="flex items-center mb-8">
              <Clock className="text-rose-500 mr-2" size={20} />
              <span className="text-gray-700">Опыт работы: {masterData.experience}</span>
            </div>

            <div className="space-y-6 mb-8">
              {/* Образование */}
              <div>
                <div className="flex items-center mb-3">
                  <ScrollText className="text-rose-500 mr-2" size={22} />
                  <h4 className="text-lg font-semibold text-rose-900">Образование и курсы</h4>
                </div>
                <ul className="space-y-2 pl-8">
                  {masterData.education.map((item, index) => (
                    <motion.li
                      key={`edu-${index}`}
                      className="flex items-start"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 * index, duration: 0.5 }}
                    >
                      <CheckCircle2 className="text-rose-400 mt-1 mr-2 flex-shrink-0" size={16} />
                      <span className="text-gray-700">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Достижения */}
              <div>
                <div className="flex items-center mb-3">
                  <Sparkles className="text-rose-500 mr-2" size={22} />
                  <h4 className="text-lg font-semibold text-rose-900">Достижения</h4>
                </div>
                <ul className="space-y-2 pl-8">
                  {masterData.achievements.map((item, index) => (
                    <motion.li
                      key={`achiev-${index}`}
                      className="flex items-start"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + 0.1 * index, duration: 0.5 }}
                    >
                      <CheckCircle2 className="text-rose-400 mt-1 mr-2 flex-shrink-0" size={16} />
                      <span className="text-gray-700">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>

            <Button asChild size="lg" className="bg-rose-500 hover:bg-rose-600">
              <Link href="/appointment">Записаться к мастеру</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
