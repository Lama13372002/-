'use client';

import type React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { GallerySlider } from '@/components/gallery/GallerySlider';

// Временные данные для галереи (в реальном приложении будем получать из базы данных)
const demoGalleryImages = [
  {
    id: 1,
    title: 'Нежный градиент',
    imageUrl: '',
    category: 'Градиент'
  },
  {
    id: 2,
    title: 'Геометрический дизайн',
    imageUrl: '',
    category: 'Минимализм'
  },
  {
    id: 3,
    title: 'Цветочный маникюр',
    imageUrl: '',
    category: 'Цветы'
  },
  {
    id: 4,
    title: 'Матовые ногти',
    imageUrl: '',
    category: 'Матовые'
  }
];

export const GalleryPreview: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-rose-900 mb-4">
            Мои работы
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Загляните в мою галерею работ, чтобы увидеть разнообразие дизайнов и мой подход к созданию идеального маникюра
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mb-10"
        >
          <GallerySlider images={demoGalleryImages} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center"
        >
          <Button asChild className="bg-rose-500 hover:bg-rose-600">
            <Link href="/gallery">Посмотреть все работы</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
