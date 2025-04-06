'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Star, MessageSquare } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import { ReviewForm } from './ReviewForm';

// Интерфейс для отзыва
interface Review {
  id: number;
  client_name: string;
  review_text: string;
  rating: number;
  avatar_url?: string;
  is_approved: boolean;
  created_at: string;
}

// Временные данные для отзывов в случае, если API недоступно
const demoReviews = [
  {
    id: 1,
    client_name: 'Екатерина В.',
    review_text: 'Отличный сервис! Делала маникюр с дизайном, держится уже третью неделю. Мастер внимательный, учла все мои пожелания. Очень довольна результатом.',
    rating: 5,
    avatar_url: '',
    is_approved: true,
    created_at: '2025-03-15T10:00:00.000Z'
  },
  // ... остальные демо-отзывы
];

export const ReviewsSection: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [reviewsPerPage, setReviewsPerPage] = useState(1);
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Получаем отзывы из API
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        // Получаем только одобренные отзывы
        const response = await fetch('/api/reviews?approved=true');

        if (!response.ok) {
          throw new Error('Не удалось загрузить отзывы');
        }

        const data = await response.json();
        setReviews(data);
      } catch (err) {
        console.error('Ошибка при загрузке отзывов:', err);
        setError('Не удалось загрузить отзывы');
        // Используем демо-данные в случае ошибки
        setReviews(demoReviews);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Определяем количество отзывов для отображения в зависимости от ширины экрана
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setReviewsPerPage(3);
      } else if (window.innerWidth >= 640) {
        setReviewsPerPage(2);
      } else {
        setReviewsPerPage(1);
      }
    };

    handleResize(); // Вызываем сразу
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Навигация по отзывам
  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const handleNext = () => {
    setActiveIndex((prev) =>
      prev < Math.max(0, reviews.length - reviewsPerPage) ? prev + 1 : prev
    );
  };

  // Форматирование даты
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'dd MMMM yyyy', { locale: ru });
    } catch (e) {
      return dateString;
    }
  };

  // Отображение звездного рейтинга
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < rating ? 'fill-rose-400 text-rose-400' : 'text-gray-300'}
      />
    ));
  };

  // Если нет отзывов, не показываем секцию
  if (!loading && reviews.length === 0 && !showReviewForm) {
    return null;
  }

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
            Отзывы клиентов
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Более 100 довольных клиентов доверяют мне заботу о своих ногтях
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center">
            <div className="w-10 h-10 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Левая колонка: отзывы */}
            <div className={`${showReviewForm ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
              {reviews.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reviews.slice(activeIndex, activeIndex + reviewsPerPage).map((review) => (
                      <motion.div
                        key={review.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="bg-rose-50 p-6 rounded-xl shadow-sm"
                      >
                        <div className="flex items-center mb-4">
                          <Avatar className="h-12 w-12 mr-4 border-2 border-rose-100">
                            <AvatarImage src={review.avatar_url || ''} alt={review.client_name} />
                            <AvatarFallback className="bg-rose-200 text-rose-700">
                              {review.client_name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold text-rose-900">{review.client_name}</h4>
                            <div className="flex mt-1">
                              {renderStars(review.rating)}
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700 mb-4">{review.review_text}</p>
                        <p className="text-sm text-gray-500">
                          {formatDate(review.created_at)}
                        </p>
                      </motion.div>
                    ))}
                  </div>

                  <div className="flex justify-center items-center mt-10 space-x-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handlePrev}
                      disabled={activeIndex === 0}
                      className="border-rose-300 text-rose-600 hover:bg-rose-50 disabled:opacity-50"
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <span className="text-gray-600">
                      {activeIndex + 1} из {Math.max(1, reviews.length - reviewsPerPage + 1)}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleNext}
                      disabled={activeIndex >= reviews.length - reviewsPerPage}
                      className="border-rose-300 text-rose-600 hover:bg-rose-50 disabled:opacity-50"
                    >
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-10">
                  <MessageSquare className="mx-auto h-16 w-16 text-rose-200 mb-4" />
                  <h3 className="text-xl font-semibold text-rose-800 mb-2">Пока нет отзывов</h3>
                  <p className="text-gray-600 mb-6">
                    Станьте первым, кто оставит отзыв о нашем сервисе
                  </p>
                </div>
              )}

              {!showReviewForm && (
                <div className="text-center mt-10">
                  <Button
                    onClick={() => setShowReviewForm(true)}
                    className="bg-rose-500 hover:bg-rose-600"
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Оставить отзыв
                  </Button>
                </div>
              )}
            </div>

            {/* Правая колонка: форма отзыва */}
            {showReviewForm && (
              <div className="lg:col-span-1">
                <ReviewForm />
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
