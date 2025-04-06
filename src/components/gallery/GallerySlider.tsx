'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GalleryImage {
  id: number;
  title: string;
  imageUrl: string;
  category: string;
}

interface GallerySliderProps {
  images: GalleryImage[];
  autoplaySpeed?: number;
  showNavigation?: boolean;
}

export const GallerySlider: React.FC<GallerySliderProps> = ({
  images,
  autoplaySpeed = 5000,
  showNavigation = true
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Функция для перехода к предыдущему слайду
  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // Функция для перехода к следующему слайду
  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Автоматическое пролистывание слайдов
  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        nextSlide();
      }, autoplaySpeed);

      return () => clearInterval(interval);
    }
  }, [currentIndex, isPaused, autoplaySpeed]);

  // Варианты анимации для слайдов
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.3 }
      }
    },
    exit: (direction: number) => ({
      x: direction > 0 ? '-100%' : '100%',
      opacity: 0,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.3 }
      }
    })
  };

  if (images.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-rose-50 rounded-lg">
        <p className="text-rose-500">Нет изображений для отображения</p>
      </div>
    );
  }

  return (
    <div
      className="relative overflow-hidden rounded-lg"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Слайдер */}
      <div className="relative aspect-[16/9] overflow-hidden">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            className="absolute inset-0"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            <div className="relative w-full h-full">
              {/* Показываем заглушку, если нет реальных изображений */}
              {images[currentIndex].imageUrl ? (
                <Image
                  src={images[currentIndex].imageUrl}
                  alt={images[currentIndex].title}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-rose-100 flex items-center justify-center">
                  <span className="text-rose-500 text-lg">Изображение маникюра</span>
                </div>
              )}

              {/* Оверлей с информацией */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                <p className="text-white text-xs mb-1">{images[currentIndex].category}</p>
                <h3 className="text-white text-xl font-semibold">{images[currentIndex].title}</h3>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Кнопки навигации */}
      {showNavigation && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 backdrop-blur-sm hover:bg-white/50 p-2 rounded-full text-white transition-colors"
            aria-label="Предыдущий слайд"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 backdrop-blur-sm hover:bg-white/50 p-2 rounded-full text-white transition-colors"
            aria-label="Следующий слайд"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Индикаторы слайдов */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? 'bg-white' : 'bg-white/50'
            }`}
            aria-label={`Перейти к слайду ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
