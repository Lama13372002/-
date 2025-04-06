'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import {
  Pencil,
  Trash2,
  Plus,
  Search,
  Scissors,
  Clock,
  Loader2
} from 'lucide-react';

// Интерфейс для услуги
interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number;
  image_url?: string;
  category?: string;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  // Состояние для новой/редактируемой услуги
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Загрузка данных
  useEffect(() => {
    // Имитация загрузки данных с сервера
    const loadServices = async () => {
      // В реальном приложении здесь будет API-запрос к /api/services
      setTimeout(() => {
        const mockServices: Service[] = [
          { id: 1, name: 'Маникюр классический', description: 'Обработка кутикулы и придание формы ногтям', price: 800, duration: 40, category: 'Маникюр' },
          { id: 2, name: 'Маникюр с гель-лаком', description: 'Маникюр с нанесением гель-лака', price: 1500, duration: 90, category: 'Маникюр' },
          { id: 3, name: 'Наращивание ногтей гелем', description: 'Наращивание ногтей гелем на формы', price: 2300, duration: 150, category: 'Наращивание' },
          { id: 4, name: 'Педикюр классический', description: 'Обработка стоп и ногтей на ногах', price: 1200, duration: 60, category: 'Педикюр' },
          { id: 5, name: 'Педикюр с гель-лаком', description: 'Педикюр с нанесением гель-лака', price: 1800, duration: 90, category: 'Педикюр' },
          { id: 6, name: 'Дизайн 1 ногтя', description: 'Художественное оформление ногтя', price: 100, duration: 10, category: 'Дизайн' },
        ];
        setServices(mockServices);
        setIsLoading(false);
      }, 1000);
    };

    loadServices();
  }, []);

  // Функция для открытия диалога создания новой услуги
  const handleCreateService = () => {
    setEditingService({
      id: 0,
      name: '',
      description: '',
      price: 0,
      duration: 30,
    });
    setIsCreating(true);
    setIsDialogOpen(true);
  };

  // Функция для открытия диалога редактирования услуги
  const handleEditService = (service: Service) => {
    setEditingService(service);
    setIsCreating(false);
    setIsDialogOpen(true);
  };

  // Функция для сохранения услуги (создание или редактирование)
  const handleSaveService = async () => {
    if (!editingService) return;

    setIsSubmitting(true);
    try {
      // Валидация
      if (!editingService.name.trim()) {
        toast({
          title: 'Ошибка',
          description: 'Название услуги обязательно для заполнения',
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return;
      }

      // В реальном приложении здесь будет API-запрос к /api/services
      // Имитация задержки сервера
      await new Promise(resolve => setTimeout(resolve, 800));

      if (isCreating) {
        // Создание новой услуги
        const newService = {
          ...editingService,
          id: Math.max(0, ...services.map(s => s.id)) + 1
        };
        setServices([...services, newService]);
        toast({
          title: 'Успешно',
          description: 'Услуга успешно создана',
        });
      } else {
        // Обновление существующей услуги
        setServices(services.map(s =>
          s.id === editingService.id ? editingService : s
        ));
        toast({
          title: 'Успешно',
          description: 'Услуга успешно обновлена',
        });
      }

      setIsDialogOpen(false);
      setEditingService(null);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить услугу',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Функция для удаления услуги
  const handleDeleteService = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить эту услугу?')) {
      return;
    }

    try {
      // В реальном приложении здесь будет API-запрос к /api/services/{id}
      // Имитация задержки сервера
      await new Promise(resolve => setTimeout(resolve, 500));

      setServices(services.filter(s => s.id !== id));
      toast({
        title: 'Успешно',
        description: 'Услуга успешно удалена',
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить услугу',
        variant: 'destructive',
      });
    }
  };

  // Фильтрация услуг по поисковому запросу
  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Группировка услуг по категориям
  const servicesByCategory = filteredServices.reduce((acc, service) => {
    const category = service.category || 'Без категории';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(service);
    return acc;
  }, {} as Record<string, Service[]>);

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-rose-700">Управление услугами</h1>
          <p className="text-gray-500 mt-1">Добавляйте, редактируйте и удаляйте услуги</p>
        </div>
        <Button
          onClick={handleCreateService}
          className="bg-rose-500 hover:bg-rose-600 text-white"
        >
          <Plus className="mr-2 h-4 w-4" /> Добавить услугу
        </Button>
      </div>

      {/* Строка поиска */}
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Поиск услуг по названию или категории..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Список услуг */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
          <span className="ml-2 text-lg text-gray-600">Загрузка услуг...</span>
        </div>
      ) : (
        <motion.div variants={container} initial="hidden" animate="show">
          {Object.entries(servicesByCategory).map(([category, categoryServices]) => (
            <motion.div key={category} variants={item} className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">{category}</h2>
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Название</TableHead>
                        <TableHead>Описание</TableHead>
                        <TableHead className="text-right">Цена</TableHead>
                        <TableHead className="text-center">Длительность</TableHead>
                        <TableHead className="text-right">Действия</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {categoryServices.map((service) => (
                        <TableRow key={service.id}>
                          <TableCell className="font-medium">{service.name}</TableCell>
                          <TableCell className="max-w-xs truncate">{service.description}</TableCell>
                          <TableCell className="text-right">{service.price.toLocaleString('ru-RU')} ₽</TableCell>
                          <TableCell className="text-center">{service.duration} мин.</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleEditService(service)}
                                title="Редактировать"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                className="text-red-500 hover:text-red-600"
                                onClick={() => handleDeleteService(service.id)}
                                title="Удалить"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {filteredServices.length === 0 && (
            <motion.div variants={item} className="text-center py-12">
              <Scissors className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">Услуги не найдены</h3>
              <p className="mt-1 text-gray-500">
                {searchQuery ? 'Попробуйте изменить параметры поиска' : 'Начните с добавления новой услуги'}
              </p>
              {searchQuery && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setSearchQuery('')}
                >
                  Сбросить поиск
                </Button>
              )}
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Диалог добавления/редактирования услуги */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isCreating ? 'Добавить новую услугу' : 'Редактировать услугу'}</DialogTitle>
            <DialogDescription>
              Заполните информацию об услуге. Все поля, кроме категории, обязательны для заполнения.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right text-sm font-medium">
                Название
              </label>
              <Input
                id="name"
                value={editingService?.name || ''}
                onChange={(e) => setEditingService(prev => prev ? {...prev, name: e.target.value} : null)}
                className="col-span-3"
                placeholder="Название услуги"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="category" className="text-right text-sm font-medium">
                Категория
              </label>
              <Input
                id="category"
                value={editingService?.category || ''}
                onChange={(e) => setEditingService(prev => prev ? {...prev, category: e.target.value} : null)}
                className="col-span-3"
                placeholder="Категория услуги (необязательно)"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="price" className="text-right text-sm font-medium">
                Стоимость (₽)
              </label>
              <Input
                id="price"
                type="number"
                value={editingService?.price || 0}
                onChange={(e) => setEditingService(prev => prev ? {...prev, price: Number(e.target.value)} : null)}
                className="col-span-3"
                min={0}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="duration" className="text-right text-sm font-medium">
                Длительность (мин)
              </label>
              <div className="col-span-3 flex items-center">
                <Input
                  id="duration"
                  type="number"
                  value={editingService?.duration || 30}
                  onChange={(e) => setEditingService(prev => prev ? {...prev, duration: Number(e.target.value)} : null)}
                  min={5}
                  step={5}
                />
                <Clock className="ml-2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <label htmlFor="description" className="text-right text-sm font-medium">
                Описание
              </label>
              <Textarea
                id="description"
                value={editingService?.description || ''}
                onChange={(e) => setEditingService(prev => prev ? {...prev, description: e.target.value} : null)}
                className="col-span-3"
                placeholder="Описание услуги"
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
              onClick={handleSaveService}
              className="bg-rose-500 hover:bg-rose-600 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isCreating ? 'Создание...' : 'Сохранение...'}
                </>
              ) : (
                <>{isCreating ? 'Создать' : 'Сохранить'}</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
