'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Search, X, Loader2, ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';

interface GalleryItem {
  id: number;
  title: string;
  description: string;
  image_url: string;
  category?: string;
  created_at: string;
}

export default function GalleryPage() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Загрузка данных галереи
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        // В реальном приложении это будет запрос к API
        // const response = await fetch('/api/gallery?public=true');
        // if (!response.ok) throw new Error('Ошибка загрузки галереи');
        // const data = await response.json();
        // setGalleryItems(data.gallery);

        // Моковые данные для демонстрации
        const mockGallery: GalleryItem[] = [
          {
            id: 1,
            title: 'Французский маникюр',
            description: 'Классический французский маникюр с белым кончиком',
            image_url: 'https://images.unsplash.com/photo-1604902396830-aca29e19b067?q=80&w=600&h=400',
            category: 'Классика',
            created_at: '2023-05-15'
          },
          {
            id: 2,
            title: 'Маникюр с цветочным дизайном',
            description: 'Нежные цветы на пастельном фоне',
            image_url: 'https://images.unsplash.com/photo-1613457838921-a1c27ef8edda?q=80&w=600&h=400',
            category: 'Дизайн',
            created_at: '2023-06-20'
          },
          {
            id: 3,
            title: 'Геометрический дизайн',
            description: 'Современный геометрический маникюр с линиями и фигурами',
            image_url: 'https://images.unsplash.com/photo-1607779097040-f06c718dc618?q=80&w=600&h=400',
            category: 'Дизайн',
            created_at: '2023-07-05'
          },
          {
            id: 4,
            title: 'Градиент',
            description: 'Плавный переход цветов от светлого к темному',
            image_url: 'https://images.unsplash.com/photo-1604654894611-6973b376cbde?q=80&w=600&h=400',
            category: 'Градиент',
            created_at: '2023-08-12'
          },
          {
            id: 5,
            title: 'Маникюр с блестками',
            description: 'Яркий маникюр с мелкими и крупными блестками',
            image_url: 'https://images.unsplash.com/photo-1621797064712-2ab2259c235c?q=80&w=600&h=400',
            category: 'Праздничный',
            created_at: '2023-09-18'
          },
          {
            id: 6,
            title: 'Праздничный дизайн',
            description: 'Новогодний маникюр со снежинками и звездами',
            image_url: 'https://images.unsplash.com/photo-1609587434991-48e9a9ae0f0c?q=80&w=600&h=400',
            category: 'Праздничный',
            created_at: '2023-12-01'
          },
          {
            id: 7,
            title: 'Минималистичный маникюр',
            description: 'Простой и элегантный дизайн с тонкими линиями',
            image_url: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798c?q=80&w=600&h=400',
            category: 'Минимализм',
            created_at: '2024-01-10'
          },
          {
            id: 8,
            title: 'Мраморный эффект',
            description: 'Маникюр с имитацией мрамора в нежных тонах',
            image_url: 'https://images.unsplash.com/photo-1612228626236-3bf6f10315ff?q=80&w=600&h=400',
            category: 'Текстуры',
            created_at: '2024-02-05'
          },
          {
            id: 9,
            title: 'Акварельный маникюр',
            description: 'Нежный маникюр с акварельным эффектом',
            image_url: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?q=80&w=600&h=400',
            category: 'Акварель',
            created_at: '2024-03-01'
          },
        ];

        setGalleryItems(mockGallery);

        // Извлекаем уникальные категории
        const uniqueCategories = Array.from(new Set(mockGallery.map(item => item.category).filter(Boolean) as string[]));
        setCategories(uniqueCategories);

        // Применяем изначальную фильтрацию
        setFilteredItems(mockGallery);

      } catch (error) {
        console.error('Ошибка при загрузке галереи:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGallery();
  }, []);

  // Фильтрация по поиску и категории
  useEffect(() => {
    let result = [...galleryItems];

    // Фильтрация по категории
    if (selectedCategory) {
      result = result.filter(item => item.category === selectedCategory);
    }

    // Фильтрация по поисковому запросу
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(item =>
        item.title.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term) ||
        (item.category && item.category.toLowerCase().includes(term))
      );
    }

    setFilteredItems(result);
  }, [galleryItems, selectedCategory, searchTerm]);

  // Открытие лайтбокса с выбранным изображением
  const openLightbox = (item: GalleryItem) => {
    setSelectedImage(item);
    setLightboxOpen(true);
  };

  // Показ следующего изображения
  const showNextImage = () => {
    if (!selectedImage) return;

    const currentIndex = filteredItems.findIndex(item => item.id === selectedImage.id);
    const nextIndex = (currentIndex + 1) % filteredItems.length;
    setSelectedImage(filteredItems[nextIndex]);
  };

  // Показ предыдущего изображения
  const showPrevImage = () => {
    if (!selectedImage) return;

    const currentIndex = filteredItems.findIndex(item => item.id === selectedImage.id);
    const prevIndex = (currentIndex - 1 + filteredItems.length) % filteredItems.length;
    setSelectedImage(filteredItems[prevIndex]);
  };

  // Анимации для элементов
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24
      }
    }
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Галерея работ</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Познакомьтесь с моими работами. Здесь представлены различные виды маникюра, дизайны и техники.
        </p>
      </motion.div>

      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Строка поиска */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Поиск по названию или описанию..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setSearchTerm('')}
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Фильтр категорий */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className={selectedCategory === null ? 'bg-rose-500 hover:bg-rose-600' : ''}
            >
              Все категории
            </Button>
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? 'bg-rose-500 hover:bg-rose-600' : ''}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Отображение галереи */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-rose-500" />
          <span className="ml-3 text-lg text-gray-600">Загрузка галереи...</span>
        </div>
      ) : filteredItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <ImageIcon className="mx-auto h-16 w-16 text-gray-300" />
          <h2 className="mt-4 text-xl font-medium text-gray-900">Работы не найдены</h2>
          <p className="mt-2 text-gray-500">
            {searchTerm || selectedCategory ?
              'Попробуйте изменить параметры поиска или выбрать другую категорию' :
              'В галерее пока нет работ'
            }
          </p>
          {(searchTerm || selectedCategory) && (
            <Button
              className="mt-4 bg-rose-100 text-rose-700 hover:bg-rose-200"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory(null);
              }}
            >
              Сбросить фильтры
            </Button>
          )}
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredItems.map(item => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="overflow-hidden rounded-lg shadow-md bg-white cursor-pointer"
              onClick={() => openLightbox(item)}
            >
              <div className="h-64 relative overflow-hidden">
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                {item.category && (
                  <span className="absolute top-2 right-2 bg-white/80 text-rose-600 text-xs px-2 py-1 rounded-full">
                    {item.category}
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Лайтбокс для просмотра увеличенных изображений */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-4xl p-0 bg-transparent border-none shadow-none">
          <div className="relative rounded-lg overflow-hidden bg-black/90">
            {selectedImage && (
              <div className="relative">
                <img
                  src={selectedImage.image_url}
                  alt={selectedImage.title}
                  className="max-h-[80vh] mx-auto object-contain"
                />

                <button
                  className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    showPrevImage();
                  }}
                >
                  <ChevronLeft size={24} />
                </button>

                <button
                  className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    showNextImage();
                  }}
                >
                  <ChevronRight size={24} />
                </button>

                <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-4 text-white">
                  <h3 className="text-lg font-medium">{selectedImage.title}</h3>
                  <p className="text-sm text-gray-300">{selectedImage.description}</p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* CTA блок */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mt-16 text-center p-8 bg-rose-50 rounded-lg shadow-inner"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Понравились работы?</h2>
        <p className="text-lg text-gray-600 mb-6">
          Запишитесь онлайн и получите такой же красивый маникюр!
        </p>
        <Link href="/appointment">
          <Button className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-6 text-lg">
            Записаться онлайн
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
