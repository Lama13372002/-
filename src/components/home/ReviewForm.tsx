'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, SendHorizonal, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export const ReviewForm = () => {
  const [name, setName] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const handleRatingClick = (newRating: number) => {
    setRating(newRating);
  };

  const handleRatingHover = (newRating: number) => {
    setHoveredRating(newRating);
  };

  const handleRatingLeave = () => {
    setHoveredRating(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !reviewText) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните все обязательные поля",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_name: name,
          review_text: reviewText,
          rating,
          is_approved: false, // Отзывы сначала проходят модерацию
        }),
      });

      if (!response.ok) {
        throw new Error('Ошибка при отправке отзыва');
      }

      setIsSuccess(true);
      toast({
        title: "Отзыв отправлен",
        description: "Спасибо за ваш отзыв! Он будет опубликован после проверки модератором.",
      });

      // Сбрасываем форму
      setName('');
      setReviewText('');
      setRating(5);

      // Через 3 секунды скрываем сообщение об успехе
      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Ошибка при отправке отзыва:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось отправить отзыв. Пожалуйста, попробуйте позже.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Подготавливаем анимацию для звезд
  const starVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.2 },
    tap: { scale: 0.9 }
  };

  // Рендер звездного рейтинга
  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => {
      const starValue = i + 1;
      return (
        <motion.div
          key={`star-${i}`}
          variants={starVariants}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
          onClick={() => handleRatingClick(starValue)}
          onMouseEnter={() => handleRatingHover(starValue)}
          onMouseLeave={handleRatingLeave}
          className="cursor-pointer"
        >
          <Star
            className={`h-6 w-6 ${
              starValue <= (hoveredRating || rating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            } transition-colors`}
          />
        </motion.div>
      );
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
    >
      <h3 className="text-xl font-semibold text-rose-800 mb-5">Оставить отзыв</h3>

      {isSuccess ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-10"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <SendHorizonal className="h-8 w-8 text-green-600" />
          </div>
          <h4 className="text-lg font-medium text-green-800 mb-2">Спасибо за ваш отзыв!</h4>
          <p className="text-gray-600">
            Ваш отзыв отправлен и будет опубликован после модерации.
          </p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Ваше имя <span className="text-rose-500">*</span>
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Имя и фамилия"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ваша оценка <span className="text-rose-500">*</span>
            </label>
            <div className="flex space-x-2 mb-1">
              {renderStars()}
            </div>
            <p className="text-sm text-gray-500">
              {rating === 5 ? 'Отлично! Очень доволен(а)' :
               rating === 4 ? 'Хорошо! Доволен(а)' :
               rating === 3 ? 'Нормально. Есть некоторые замечания' :
               rating === 2 ? 'Плохо. Много недостатков' :
               'Очень плохо. Не рекомендую'}
            </p>
          </div>

          <div>
            <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-1">
              Ваш отзыв <span className="text-rose-500">*</span>
            </label>
            <Textarea
              id="review"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Поделитесь своими впечатлениями..."
              rows={4}
              required
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              className="w-full bg-rose-500 hover:bg-rose-600 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Отправка...
                </>
              ) : (
                <>
                  <SendHorizonal className="mr-2 h-4 w-4" />
                  Отправить отзыв
                </>
              )}
            </Button>
            <p className="text-xs text-gray-500 text-center mt-2">
              Все отзывы проходят модерацию перед публикацией
            </p>
          </div>
        </form>
      )}
    </motion.div>
  );
};
