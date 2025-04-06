'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  Search,
  ImagePlus,
  Edit,
  Trash2,
  Upload,
  X,
  Image as ImageIcon,
  Loader2
} from 'lucide-react';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Состояние для новой/редактируемой галерейной работы
  const [editingItem, setEditingItem] = useState<Partial<GalleryItem> | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Загрузка данных
  useEffect(() => {
    // Имитация загрузки данных с сервера
    const loadGalleryItems = async () => {
      // В реальном приложении здесь будет API-запрос к /api/gallery
      setTimeout(() => {
        const mockItems: GalleryItem[] = [
          {
            id: 1,
            title: 'Французский маникюр',
            description: 'Классический французский маникюр с белым кончиком',
            image_url: 'https://images.unsplash.com/photo-1604902396830-aca29e19b067?q=80&w=400',
            category: 'Классика',
            created_at: '2023-05-15'
          },
          {
            id: 2,
            title: 'Маникюр с цветочным дизайном',
            description: 'Нежные цветы на пастельном фоне',
            image_url: 'https://images.unsplash.com/photo-1613457838921-a1c27ef8edda?q=80&w=400',
            category: 'Дизайн',
            created_at: '2023-06-20'
          },
          {
            id: 3,
            title: 'Геометрический дизайн',
            description: 'Современный геометрический маникюр с линиями и фигурами',
            image_url: 'https://images.unsplash.com/photo-1607779097040-f06c718dc618?q=80&w=400',
            category: 'Дизайн',
            created_at: '2023-07-05'
          },
          {
            id: 4,
            title: 'Градиент',
            description: 'Плавный переход цветов от светлого к темному',
            image_url: 'https://images.unsplash.com/photo-1604654894611-6973b376cbde?q=80&w=400',
            category: 'Градиент',
            created_at: '2023-08-12'
          },
          {
            id: 5,
            title: 'Маникюр с блестками',
            description: 'Яркий маникюр с мелкими и крупными блестками',
            image_url: 'https://images.unsplash.com/photo-1621797064712-2ab2259c235c?q=80&w=400',
            category: 'Праздничный',
            created_at: '2023-09-18'
          },
          {
            id: 6,
            title: 'Праздничный дизайн',
            description: 'Новогодний маникюр со снежинками и звездами',
            image_url: 'https://images.unsplash.com/photo-1609587434991-48e9a9ae0f0c?q=80&w=400',
            category: 'Праздничный',
            created_at: '2023-12-01'
          },
        ];
        setGalleryItems(mockItems);
        setIsLoading(false);
      }, 1000);
    };

    loadGalleryItems();
  }, []);

  // Функция для открытия диалога создания новой работы
  const handleCreateItem = () => {
    setEditingItem({
      title: '',
      description: '',
      image_url: '',
      category: ''
    });
    setPreviewImage(null);
    setIsCreating(true);
    setIsDialogOpen(true);
  };

  // Функция для открытия диалога редактирования работы
  const handleEditItem = (item: GalleryItem) => {
    setEditingItem(item);
    setPreviewImage(item.image_url);
    setIsCreating(false);
    setIsDialogOpen(true);
  };

  // Обработчик изменения файла
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Проверка типа файла
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Ошибка',
        description: 'Пожалуйста, выберите изображение',
        variant: 'destructive',
      });
      return;
    }

    // Создание URL для предпросмотра
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setPreviewImage(e.target.result as string);

        // В реальном приложении здесь будет загрузка файла на сервер
        // и получение URL изображения, который мы сохраним в базе данных
        // Для мок-данных просто имитируем URL
        if (editingItem) {
          setEditingItem({
            ...editingItem,
            image_url: e.target.result as string
          });
        }
      }
    };
    reader.readAsDataURL(file);
  };

  // Функция для удаления предпросмотра изображения
  const handleRemovePreview = () => {
    setPreviewImage(null);
    if (editingItem) {
      setEditingItem({
        ...editingItem,
        image_url: ''
      });
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Функция для сохранения галерейной работы
  const handleSaveItem = async () => {
    if (!editingItem) return;

    // Валидация
    if (!editingItem.title?.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Название работы обязательно для заполнения',
        variant: 'destructive',
      });
      return;
    }

    if (!editingItem.image_url && !previewImage) {
      toast({
        title: 'Ошибка',
        description: 'Необходимо загрузить изображение',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Имитация запроса к API
      await new Promise(resolve => setTimeout(resolve, 800));

      if (isCreating) {
        // Создание новой работы
        const newItem: GalleryItem = {
          id: Math.max(0, ...galleryItems.map(item => item.id)) + 1,
          title: editingItem.title!,
          description: editingItem.description || '',
          image_url: previewImage || editingItem.image_url!,
          category: editingItem.category || 'Без категории',
          created_at: new Date().toISOString().split('T')[0]
        };
        setGalleryItems([...galleryItems, newItem]);
        toast({
          title: 'Успешно',
          description: 'Работа успешно добавлена в галерею',
        });
      } else {
        // Обновление существующей работы
        const updatedItem = {
          ...editingItem,
          image_url: previewImage || editingItem.image_url!,
        } as GalleryItem;

        setGalleryItems(galleryItems.map(item =>
          item.id === updatedItem.id ? updatedItem : item
        ));
        toast({
          title: 'Успешно',
          description: 'Работа успешно обновлена',
        });
      }

      setIsDialogOpen(false);
      setEditingItem(null);
      setPreviewImage(null);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить работу',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Функция для удаления работы
  const handleDeleteItem = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить эту работу из галереи?')) {
      return;
    }

    try {
      // Имитация запроса к API
      await new Promise(resolve => setTimeout(resolve, 500));

      setGalleryItems(galleryItems.filter(item => item.id !== id));
      toast({
        title: 'Успешно',
        description: 'Работа успешно удалена из галереи',
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить работу',
        variant: 'destructive',
      });
    }
  };

  // Фильтрация работ по поисковому запросу
  const filteredItems = galleryItems.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Группировка работ по категориям
  const itemsByCategory = filteredItems.reduce((acc, item) => {
    const category = item.category || 'Без категории';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, GalleryItem[]>);

  // Анимация для элементов галереи
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-rose-700">Галерея работ</h1>
          <p className="text-gray-500 mt-1">Управление фотографиями ваших работ</p>
        </div>
        <Button
          onClick={handleCreateItem}
          className="bg-rose-500 hover:bg-rose-600 text-white"
        >
          <ImagePlus className="mr-2 h-4 w-4" /> Добавить работу
        </Button>
      </div>

      {/* Строка поиска */}
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Поиск работ по названию или категории..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Галерея работ */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
          <span className="ml-2 text-lg text-gray-600">Загрузка галереи...</span>
        </div>
      ) : (
        <motion.div variants={container} initial="hidden" animate="show">
          {Object.entries(itemsByCategory).length > 0 ? (
            Object.entries(itemsByCategory).map(([category, items]) => (
              <motion.div key={category} variants={item} className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">{category}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map((galleryItem) => (
                    <motion.div key={galleryItem.id} variants={item}>
                      <Card className="overflow-hidden h-full hover:shadow-md transition-shadow">
                        <div className="relative h-48 overflow-hidden bg-gray-100">
                          <img
                            src={galleryItem.image_url}
                            alt={galleryItem.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2 flex space-x-1">
                            <Button
                              variant="secondary"
                              size="icon"
                              className="w-8 h-8 bg-white/80 hover:bg-white"
                              onClick={() => handleEditItem(galleryItem)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="secondary"
                              size="icon"
                              className="w-8 h-8 bg-white/80 hover:bg-white text-red-500"
                              onClick={() => handleDeleteItem(galleryItem.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-medium text-lg truncate">{galleryItem.title}</h3>
                          <p className="text-gray-500 text-sm mt-1 line-clamp-2">{galleryItem.description}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div variants={item} className="text-center py-12">
              <ImageIcon className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">Работы не найдены</h3>
              <p className="mt-1 text-gray-500">
                {searchTerm ? 'Попробуйте изменить параметры поиска' : 'Начните с добавления новой работы в галерею'}
              </p>
              {searchTerm && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setSearchTerm('')}
                >
                  Сбросить поиск
                </Button>
              )}
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Диалог добавления/редактирования работы */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) {
          setPreviewImage(null);
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isCreating ? 'Добавить новую работу' : 'Редактировать работу'}</DialogTitle>
            <DialogDescription>
              Загрузите фото работы и заполните информацию о ней
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Загрузка изображения */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Изображение работы
              </label>

              {previewImage ? (
                <div className="relative mb-2">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-full h-40 object-cover rounded-md"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8"
                    onClick={handleRemovePreview}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div
                  className="border-2 border-dashed border-gray-200 rounded-md p-8 text-center hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">
                    Нажмите, чтобы загрузить изображение
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    PNG, JPG, WebP до 5MB
                  </p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />

              {!previewImage && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Выбрать файл
                </Button>
              )}
            </div>

            {/* Название работы */}
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="title" className="text-right text-sm font-medium">
                Название
              </label>
              <Input
                id="title"
                value={editingItem?.title || ''}
                onChange={(e) => setEditingItem(prev => prev ? {...prev, title: e.target.value} : null)}
                className="col-span-3"
                placeholder="Название работы"
              />
            </div>

            {/* Категория */}
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="category" className="text-right text-sm font-medium">
                Категория
              </label>
              <Input
                id="category"
                value={editingItem?.category || ''}
                onChange={(e) => setEditingItem(prev => prev ? {...prev, category: e.target.value} : null)}
                className="col-span-3"
                placeholder="Категория работы"
              />
            </div>

            {/* Описание */}
            <div className="grid grid-cols-4 items-start gap-4">
              <label htmlFor="description" className="text-right text-sm font-medium">
                Описание
              </label>
              <Textarea
                id="description"
                value={editingItem?.description || ''}
                onChange={(e) => setEditingItem(prev => prev ? {...prev, description: e.target.value} : null)}
                className="col-span-3"
                placeholder="Описание работы"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isSubmitting}
            >
              Отмена
            </Button>
            <Button
              onClick={handleSaveItem}
              className="bg-rose-500 hover:bg-rose-600 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isCreating ? 'Создание...' : 'Сохранение...'}
                </>
              ) : (
                <>{isCreating ? 'Добавить в галерею' : 'Сохранить изменения'}</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
