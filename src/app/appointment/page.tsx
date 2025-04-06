'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format, addDays, setHours, setMinutes, isAfter, isBefore } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, CalendarIcon, Clock, CalendarCheck, Loader2 } from 'lucide-react';
import Link from 'next/link';

// Интерфейс для услуги
interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number;
  category?: string;
}

// Доступные временные слоты
interface TimeSlot {
  time: string;
  available: boolean;
}

// Схема валидации формы
const appointmentSchema = z.object({
  clientName: z.string().min(2, { message: 'Имя должно содержать минимум 2 символа' }),
  clientPhone: z.string().min(10, { message: 'Введите корректный номер телефона' }),
  clientEmail: z.string().email({ message: 'Введите корректный email' }).optional().or(z.literal('')),
  serviceId: z.string({ required_error: 'Выберите услугу' }),
  appointmentDate: z.date({ required_error: 'Выберите дату' }),
  appointmentTime: z.string({ required_error: 'Выберите время' }),
  notes: z.string().optional(),
});

type AppointmentFormValues = z.infer<typeof appointmentSchema>;

export default function AppointmentPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  // Границы календаря
  const today = new Date();
  const minDate = today;
  const maxDate = addDays(today, 30);

  // Настройка формы
  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      clientName: '',
      clientPhone: '',
      clientEmail: '',
      serviceId: '',
      notes: '',
    },
  });

  // Наблюдаем за изменением даты и услуги
  const selectedDate = form.watch('appointmentDate');
  const selectedService = form.watch('serviceId');

  // Загрузка услуг
  useEffect(() => {
    const loadServices = async () => {
      try {
        // Запрос к API для получения услуг
        const response = await fetch('/api/services');
        if (!response.ok) {
          throw new Error('Ошибка при загрузке услуг');
        }

        const data = await response.json();
        setServices(data.services || []);
      } catch (error) {
        console.error('Ошибка при загрузке услуг:', error);
        // Используем тестовые данные в случае ошибки
        const mockServices: Service[] = [
          { id: 1, name: 'Маникюр классический', description: 'Обработка кутикулы и придание формы ногтям', price: 800, duration: 40, category: 'Маникюр' },
          { id: 2, name: 'Маникюр с гель-лаком', description: 'Маникюр с нанесением гель-лака', price: 1500, duration: 90, category: 'Маникюр' },
          { id: 3, name: 'Наращивание ногтей гелем', description: 'Наращивание ногтей гелем на формы', price: 2300, duration: 150, category: 'Наращивание' },
          { id: 4, name: 'Педикюр классический', description: 'Обработка стоп и ногтей на ногах', price: 1200, duration: 60, category: 'Педикюр' },
          { id: 5, name: 'Педикюр с гель-лаком', description: 'Педикюр с нанесением гель-лака', price: 1800, duration: 90, category: 'Педикюр' },
          { id: 6, name: 'Дизайн 1 ногтя', description: 'Художественное оформление ногтя', price: 100, duration: 10, category: 'Дизайн' },
        ];
        setServices(mockServices);
      } finally {
        setIsLoading(false);
      }
    };

    loadServices();
  }, []);

  // Генерация доступных временных слотов при выборе даты и услуги
  useEffect(() => {
    if (!selectedDate || !selectedService) return;

    const loadTimeSlots = async () => {
      try {
        // Форматируем дату для API запроса (YYYY-MM-DD)
        const formattedDate = format(selectedDate, 'yyyy-MM-dd');

        // Запрос к API для получения доступных слотов
        const response = await fetch(`/api/available-slots?date=${formattedDate}&serviceId=${selectedService}`);
        if (!response.ok) {
          throw new Error('Ошибка при загрузке доступных слотов');
        }

        const data = await response.json();
        setTimeSlots(data.timeSlots || []);
      } catch (error) {
        console.error('Ошибка при загрузке временных слотов:', error);
        // Используем простую генерацию слотов в случае ошибки
        const generateTimeSlots = () => {
          const workStartHour = 10; // Начало рабочего дня (10:00)
          const workEndHour = 20;   // Конец рабочего дня (20:00)
          const intervalMinutes = 30; // Интервал между слотами в минутах
          const slots: TimeSlot[] = [];

          // Генерация слотов с 10:00 до 20:00 с интервалом 30 минут
          for (let hour = workStartHour; hour < workEndHour; hour++) {
            for (let minute = 0; minute < 60; minute += intervalMinutes) {
              const slotTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

              // Определение доступности слота (в упрощенном варианте)
              const isAvailable = Math.random() > 0.3; // 30% слотов будут недоступны

              slots.push({
                time: slotTime,
                available: isAvailable
              });
            }
          }

          setTimeSlots(slots);
        };

        generateTimeSlots();
      }
    };

    loadTimeSlots();
  }, [selectedDate, selectedService]);

  // Обработка отправки формы
  const onSubmit = async (data: AppointmentFormValues) => {
    setIsSubmitting(true);

    try {
      // Форматируем дату для API запроса (YYYY-MM-DD)
      const formattedDate = format(data.appointmentDate, 'yyyy-MM-dd');

      // Подготавливаем данные для отправки
      const appointmentData = {
        clientName: data.clientName,
        clientPhone: data.clientPhone,
        clientEmail: data.clientEmail,
        serviceId: data.serviceId,
        appointmentDate: formattedDate,
        appointmentTime: data.appointmentTime,
        notes: data.notes
      };

      // Отправляем запрос на создание записи
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка при создании записи');
      }

      const result = await response.json();

      // Показываем сообщение об успешной записи
      toast({
        title: 'Запись создана!',
        description: `Вы успешно записаны на ${format(data.appointmentDate, 'PPP', { locale: ru })} в ${data.appointmentTime}`,
      });

      // Переходим к странице успешной записи
      setIsSuccess(true);

    } catch (error) {
      console.error('Ошибка при создании записи:', error);
      toast({
        title: 'Ошибка при создании записи',
        description: error instanceof Error ? error.message : 'Пожалуйста, попробуйте еще раз позже',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Анимации
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: 'beforeChildren',
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24,
      },
    },
  };

  // Страница успешной записи
  if (isSuccess) {
    return (
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="text-center"
        >
          <div className="flex justify-center">
            <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center mb-6">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Запись успешно создана!</h1>
          <p className="text-lg text-gray-600 mb-8">
            Благодарим за запись! В ближайшее время мы свяжемся с вами для подтверждения.
          </p>
          <div className="bg-white rounded-lg shadow-md p-6 mb-8 max-w-lg mx-auto">
            <h2 className="text-xl font-medium text-gray-900 mb-4">Детали вашей записи:</h2>
            <div className="space-y-3">
              <div className="flex items-center text-gray-600">
                <CalendarIcon className="mr-2 h-5 w-5 text-rose-500" />
                <span>Дата: {format(form.getValues('appointmentDate'), 'PPP', { locale: ru })}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="mr-2 h-5 w-5 text-rose-500" />
                <span>Время: {form.getValues('appointmentTime')}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <CalendarCheck className="mr-2 h-5 w-5 text-rose-500" />
                <span>Услуга: {services.find(s => s.id.toString() === form.getValues('serviceId'))?.name}</span>
              </div>
            </div>
          </div>
          <div className="flex justify-center space-x-4">
            <Link href="/">
              <Button variant="outline">Вернуться на главную</Button>
            </Link>
            <Link href="/gallery">
              <Button className="bg-rose-500 hover:bg-rose-600 text-white">Посмотреть галерею работ</Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        <motion.div variants={itemVariants} className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Онлайн-запись на маникюр</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Выберите удобную для вас дату, время и услугу. Заполните форму, и мы свяжемся с вами для подтверждения записи.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
            <span className="ml-2 text-lg text-gray-600">Загрузка данных...</span>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Левая колонка - личные данные */}
                <motion.div variants={itemVariants}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Ваши данные</CardTitle>
                      <CardDescription>
                        Пожалуйста, укажите свои контактные данные
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="clientName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Имя</FormLabel>
                            <FormControl>
                              <Input placeholder="Введите ваше имя" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="clientPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Телефон</FormLabel>
                            <FormControl>
                              <Input placeholder="+7 (___) ___-__-__" {...field} />
                            </FormControl>
                            <FormDescription>
                              Мы позвоним для подтверждения записи
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="clientEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email (необязательно)</FormLabel>
                            <FormControl>
                              <Input placeholder="example@mail.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Примечания (необязательно)</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Пожелания или дополнительная информация"
                                {...field}
                                className="resize-none"
                                rows={3}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Правая колонка - выбор услуги, даты и времени */}
                <motion.div variants={itemVariants} className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Выберите услугу</CardTitle>
                      <CardDescription>
                        Укажите, какую услугу вы хотели бы получить
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <FormField
                        control={form.control}
                        name="serviceId"
                        render={({ field }) => (
                          <FormItem>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Выберите услугу" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {services.map((service) => (
                                  <SelectItem key={service.id} value={service.id.toString()}>
                                    {service.name} - {service.price} ₽
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Выберите дату</CardTitle>
                      <CardDescription>
                        Запись доступна на 30 дней вперед
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <FormField
                        control={form.control}
                        name="appointmentDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              fromDate={minDate}
                              toDate={maxDate}
                              locale={ru}
                              className="border rounded-md"
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  {selectedDate && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                    >
                      <Card>
                        <CardHeader>
                          <CardTitle>Выберите время</CardTitle>
                          <CardDescription>
                            Доступное время на {format(selectedDate, 'PPP', { locale: ru })}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <FormField
                            control={form.control}
                            name="appointmentTime"
                            render={({ field }) => (
                              <FormItem>
                                <div className="grid grid-cols-4 gap-2">
                                  {timeSlots.map((slot) => (
                                    <Button
                                      key={slot.time}
                                      type="button"
                                      variant={field.value === slot.time ? 'default' : 'outline'}
                                      className={`${
                                        !slot.available ? 'opacity-50 cursor-not-allowed' : ''
                                      } ${
                                        field.value === slot.time ? 'bg-rose-500 hover:bg-rose-600 text-white' : ''
                                      }`}
                                      onClick={() => slot.available && field.onChange(slot.time)}
                                      disabled={!slot.available}
                                    >
                                      {slot.time}
                                    </Button>
                                  ))}
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </motion.div>
              </div>

              <motion.div
                variants={itemVariants}
                className="flex justify-center"
              >
                <Button
                  type="submit"
                  className="bg-rose-500 hover:bg-rose-600 text-white px-8 py-6 text-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Обработка...
                    </>
                  ) : (
                    'Записаться'
                  )}
                </Button>
              </motion.div>
            </form>
          </Form>
        )}
      </motion.div>
    </div>
  );
}
