'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  CheckCircle,
  XCircle,
  Star,
  Search,
  UserCircle2,
  Calendar,
  MessageSquare,
  Loader2
} from 'lucide-react';

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

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<Review>>({});
  const [processing, setProcessing] = useState(false);

  const { toast } = useToast();

  // Загрузка отзывов
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/reviews');

        if (!response.ok) {
          throw new Error('Не удалось загрузить отзывы');
        }

        const data = await response.json();
        setReviews(data);
        setFilteredReviews(data);
      } catch (error) {
        console.error('Ошибка при загрузке отзывов:', error);
        toast({
          title: 'Ошибка',
          description: 'Не удалось загрузить отзывы. Пожалуйста, попробуйте позже.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [toast]);

  // Фильтрация отзывов
  useEffect(() => {
    let result = [...reviews];

    // Фильтрация по табу
    if (activeTab === 'approved') {
      result = result.filter(review => review.is_approved);
    } else if (activeTab === 'pending') {
      result = result.filter(review => !review.is_approved);
    }

    // Фильтрация по поиску
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(
        review =>
          review.client_name.toLowerCase().includes(search) ||
          review.review_text.toLowerCase().includes(search)
      );
    }

    setFilteredReviews(result);
  }, [reviews, activeTab, searchTerm]);

  // Обработка изменения поля формы редактирования
  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  // Обработка изменения рейтинга
  const handleRatingChange = (newRating: number) => {
    setEditFormData(prev => ({ ...prev, rating: newRating }));
  };

  // Отображение звездного рейтинга
  const renderStars = (rating: number, editable = false) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        } ${editable ? 'cursor-pointer' : ''}`}
        onClick={editable ? () => handleRatingChange(i + 1) : undefined}
      />
    ));
  };

  // Изменение статуса одобрения отзыва
  const handleApprovalToggle = async (review: Review) => {
    try {
      setProcessing(true);

      const response = await fetch(`/api/reviews/${review.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_approved: !review.is_approved }),
      });

      if (!response.ok) {
        throw new Error('Не удалось обновить статус отзыва');
      }

      const updatedReview = await response.json();

      // Обновляем список отзывов
      setReviews(reviews.map(r => r.id === updatedReview.id ? updatedReview : r));

      toast({
        title: 'Статус изменен',
        description: updatedReview.is_approved
          ? 'Отзыв одобрен и теперь будет отображаться на сайте'
          : 'Отзыв скрыт с сайта',
      });
    } catch (error) {
      console.error('Ошибка при обновлении статуса:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить статус отзыва',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  // Открытие диалогового окна редактирования
  const openEditDialog = (review: Review) => {
    setSelectedReview(review);
    setEditFormData({
      client_name: review.client_name,
      review_text: review.review_text,
      rating: review.rating,
      avatar_url: review.avatar_url,
    });
    setIsEditing(true);
  };

  // Сохранение отредактированного отзыва
  const handleSaveEdit = async () => {
    if (!selectedReview) return;

    try {
      setProcessing(true);

      const response = await fetch(`/api/reviews/${selectedReview.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFormData),
      });

      if (!response.ok) {
        throw new Error('Не удалось обновить отзыв');
      }

      const updatedReview = await response.json();

      // Обновляем список отзывов
      setReviews(reviews.map(r => r.id === updatedReview.id ? updatedReview : r));

      toast({
        title: 'Отзыв обновлен',
        description: 'Изменения успешно сохранены',
      });

      // Закрываем диалог
      setIsEditing(false);
      setSelectedReview(null);
    } catch (error) {
      console.error('Ошибка при редактировании отзыва:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить отзыв. Пожалуйста, попробуйте позже.',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  // Открытие диалогового окна удаления
  const openDeleteDialog = (review: Review) => {
    setSelectedReview(review);
    setIsDeleteDialogOpen(true);
  };

  // Удаление отзыва
  const handleDeleteReview = async () => {
    if (!selectedReview) return;

    try {
      setProcessing(true);

      const response = await fetch(`/api/reviews/${selectedReview.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Не удалось удалить отзыв');
      }

      // Удаляем отзыв из списка
      setReviews(reviews.filter(r => r.id !== selectedReview.id));

      toast({
        title: 'Отзыв удален',
        description: 'Отзыв успешно удален из системы',
      });

      // Закрываем диалог
      setIsDeleteDialogOpen(false);
      setSelectedReview(null);
    } catch (error) {
      console.error('Ошибка при удалении отзыва:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить отзыв. Пожалуйста, попробуйте позже.',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  // Форматирование даты
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'dd MMMM yyyy, HH:mm', { locale: ru });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-rose-900 mb-2">Управление отзывами</h1>
          <p className="text-gray-600">
            Одобряйте, редактируйте и удаляйте отзывы клиентов
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Отзывы клиентов</CardTitle>
            <CardDescription>
              Всего отзывов: {reviews.length} | Опубликовано: {reviews.filter(r => r.is_approved).length}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Поиск отзывов..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="all">Все</TabsTrigger>
                  <TabsTrigger value="approved">Опубликованные</TabsTrigger>
                  <TabsTrigger value="pending">На модерации</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
                <span className="ml-3 text-rose-900">Загрузка отзывов...</span>
              </div>
            ) : filteredReviews.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <MessageSquare className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p className="text-lg mb-1">Отзывы не найдены</p>
                <p className="text-sm">
                  {searchTerm
                    ? 'Попробуйте изменить условия поиска'
                    : activeTab === 'approved'
                    ? 'У вас пока нет опубликованных отзывов'
                    : activeTab === 'pending'
                    ? 'У вас нет отзывов, ожидающих модерации'
                    : 'У вас пока нет отзывов от клиентов'}
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredReviews.map((review) => (
                  <Card key={review.id} className="overflow-hidden">
                    <div className={`h-1 ${review.is_approved ? 'bg-green-500' : 'bg-amber-500'}`} />
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <div className="flex-grow">
                          <div className="flex items-center mb-2">
                            <div className="h-8 w-8 rounded-full bg-rose-100 flex items-center justify-center mr-3">
                              <UserCircle2 className="h-5 w-5 text-rose-600" />
                            </div>
                            <div>
                              <h3 className="font-medium">{review.client_name}</h3>
                              <div className="flex items-center">
                                <div className="flex mr-3">
                                  {renderStars(review.rating)}
                                </div>
                                <span className="text-sm text-gray-500">
                                  <Calendar className="h-3 w-3 inline mr-1" />
                                  {formatDate(review.created_at)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-700 mt-2">{review.review_text}</p>
                        </div>
                        <div className="flex sm:flex-col gap-2 self-end sm:self-center">
                          <Button
                            variant="outline"
                            size="sm"
                            className={review.is_approved ? 'border-red-200 text-red-600' : 'border-green-200 text-green-600'}
                            onClick={() => handleApprovalToggle(review)}
                            disabled={processing}
                          >
                            {review.is_approved ? (
                              <XCircle className="h-4 w-4 mr-1" />
                            ) : (
                              <CheckCircle className="h-4 w-4 mr-1" />
                            )}
                            {review.is_approved ? 'Скрыть' : 'Одобрить'}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-blue-200 text-blue-600"
                            onClick={() => openEditDialog(review)}
                          >
                            Редактировать
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-red-200 text-red-600"
                            onClick={() => openDeleteDialog(review)}
                          >
                            Удалить
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <p className="text-sm text-gray-500">
              {filteredReviews.length > 0
                ? `Показано ${filteredReviews.length} из ${reviews.length} отзывов`
                : ''}
            </p>
          </CardFooter>
        </Card>
      </motion.div>

      {/* Диалог редактирования отзыва */}
      <Dialog open={isEditing} onOpenChange={(open) => !processing && setIsEditing(open)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Редактирование отзыва</DialogTitle>
            <DialogDescription>
              Внесите изменения в отзыв. Нажмите сохранить, когда закончите.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="client_name" className="text-sm font-medium">
                Имя клиента
              </label>
              <Input
                id="client_name"
                name="client_name"
                value={editFormData.client_name || ''}
                onChange={handleEditFormChange}
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Рейтинг</label>
              <div className="flex gap-1">
                {renderStars(editFormData.rating || 0, true)}
              </div>
            </div>
            <div className="grid gap-2">
              <label htmlFor="review_text" className="text-sm font-medium">
                Текст отзыва
              </label>
              <Textarea
                id="review_text"
                name="review_text"
                rows={5}
                value={editFormData.review_text || ''}
                onChange={handleEditFormChange}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="avatar_url" className="text-sm font-medium">
                URL аватара (необязательно)
              </label>
              <Input
                id="avatar_url"
                name="avatar_url"
                value={editFormData.avatar_url || ''}
                onChange={handleEditFormChange}
                placeholder="https://example.com/avatar.jpg"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditing(false)} disabled={processing}>
              Отмена
            </Button>
            <Button onClick={handleSaveEdit} disabled={processing}>
              {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Диалог подтверждения удаления */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={(open) => !processing && setIsDeleteDialogOpen(open)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Удаление отзыва</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить этот отзыв? Это действие нельзя отменить.
            </DialogDescription>
          </DialogHeader>
          {selectedReview && (
            <div className="py-4">
              <p className="mb-2">
                <span className="font-medium">Клиент:</span> {selectedReview.client_name}
              </p>
              <p className="mb-2">
                <span className="font-medium">Рейтинг:</span>{' '}
                <span className="flex inline-flex">{renderStars(selectedReview.rating)}</span>
              </p>
              <p className="mb-2">
                <span className="font-medium">Текст отзыва:</span>
              </p>
              <p className="text-gray-700 text-sm border rounded p-2 bg-gray-50">
                {selectedReview.review_text}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={processing}>
              Отмена
            </Button>
            <Button variant="destructive" onClick={handleDeleteReview} disabled={processing}>
              {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Удалить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
