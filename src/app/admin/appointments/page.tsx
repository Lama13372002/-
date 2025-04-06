'use client';

import React, { useState, useEffect } from 'react';
import { format, parseISO, isToday, isAfter, isBefore, addDays } from 'date-fns';
import { ru } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  CalendarIcon,
  Clock,
  User,
  MessageSquare,
  Phone,
  CheckCircle2,
  XCircle,
  Mail,
  ClipboardList,
  Loader2,
  AlertCircle,
  Search
} from 'lucide-react';
import { Input } from '@/components/ui/input';

// Интерфейс для записи клиента
interface Appointment {
  id: number;
  client_name: string;
  client_phone: string;
  client_email?: string;
  service_id: number;
  service_name: string;
  appointment_date: string;
  appointment_time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  created_at: string;
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  // Загрузка данных
  useEffect(() => {
    // Имитация загрузки данных с сервера
    const loadAppointments = async () => {
      // В реальном приложении здесь будет API-запрос к /api/appointments
      setTimeout(() => {
        const startDate = new Date();
        const mockAppointments: Appointment[] = [
          {
            id: 1,
            client_name: 'Анна Иванова',
            client_phone: '+7 (901) 123-45-67',
            client_email: 'anna@example.com',
            service_id: 1,
            service_name: 'Маникюр классический',
            appointment_date: format(startDate, 'yyyy-MM-dd'),
            appointment_time: '10:00',
            status: 'confirmed',
            notes: 'Аллергия на некоторые лаки',
            created_at: '2023-04-01'
          },
          {
            id: 2,
            client_name: 'Елена Петрова',
            client_phone: '+7 (902) 234-56-78',
            service_id: 2,
            service_name: 'Маникюр с гель-лаком',
            appointment_date: format(startDate, 'yyyy-MM-dd'),
            appointment_time: '12:30',
            status: 'pending',
            created_at: '2023-04-02'
          },
          {
            id: 3,
            client_name: 'Мария Сидорова',
            client_phone: '+7 (903) 345-67-89',
            client_email: 'maria@example.com',
            service_id: 3,
            service_name: 'Наращивание ногтей',
            appointment_date: format(addDays(startDate, 1), 'yyyy-MM-dd'),
            appointment_time: '14:00',
            status: 'confirmed',
            created_at: '2023-04-03'
          },
          {
            id: 4,
            client_name: 'Софья Козлова',
            client_phone: '+7 (904) 456-78-90',
            service_id: 4,
            service_name: 'Педикюр классический',
            appointment_date: format(addDays(startDate, 2), 'yyyy-MM-dd'),
            appointment_time: '11:00',
            status: 'confirmed',
            created_at: '2023-04-04'
          },
          {
            id: 5,
            client_name: 'Ирина Николаева',
            client_phone: '+7 (905) 567-89-01',
            client_email: 'irina@example.com',
            service_id: 5,
            service_name: 'Педикюр с гель-лаком',
            appointment_date: format(addDays(startDate, -1), 'yyyy-MM-dd'),
            appointment_time: '15:30',
            status: 'completed',
            notes: 'Постоянный клиент, предпочитает спокойные тона',
            created_at: '2023-04-05'
          },
          {
            id: 6,
            client_name: 'Татьяна Морозова',
            client_phone: '+7 (906) 678-90-12',
            service_id: 2,
            service_name: 'Маникюр с гель-лаком',
            appointment_date: format(addDays(startDate, -2), 'yyyy-MM-dd'),
            appointment_time: '17:00',
            status: 'cancelled',
            notes: 'Отменила из-за болезни',
            created_at: '2023-04-06'
          }
        ];
        setAppointments(mockAppointments);
        filterAppointmentsByDate(selectedDate!, mockAppointments);
        setIsLoading(false);
      }, 1000);
    };

    loadAppointments();
  }, []);

  // Фильтрация записей по дате
  const filterAppointmentsByDate = (date: Date, appointmentsList = appointments) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const filtered = appointmentsList.filter(app => app.appointment_date === dateStr);
    setFilteredAppointments(filtered);
  };

  // Обработчик изменения даты в календаре
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      filterAppointmentsByDate(date);
    }
  };

  // Поиск по записям
  useEffect(() => {
    if (!searchQuery.trim()) {
      // Если поисковый запрос пустой, показываем записи по выбранной дате
      if (selectedDate) {
        filterAppointmentsByDate(selectedDate);
      }
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = appointments.filter(app =>
      app.client_name.toLowerCase().includes(query) ||
      app.client_phone.includes(query) ||
      (app.client_email && app.client_email.toLowerCase().includes(query)) ||
      app.service_name.toLowerCase().includes(query)
    );

    setFilteredAppointments(results);
  }, [searchQuery, appointments]);

  // Показ деталей записи
  const handleViewAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsDialogOpen(true);
  };

  // Изменение статуса записи
  const handleUpdateStatus = async (status: Appointment['status']) => {
    if (!selectedAppointment) return;

    setIsUpdating(true);
    try {
      // Имитация запроса к API
      await new Promise(resolve => setTimeout(resolve, 800));

      // Обновляем статус в локальном состоянии
      const updatedAppointments = appointments.map(app =>
        app.id === selectedAppointment.id ? { ...app, status } : app
      );

      setAppointments(updatedAppointments);
      setSelectedAppointment({ ...selectedAppointment, status });

      // Обновляем отфильтрованный список
      if (selectedDate) {
        filterAppointmentsByDate(selectedDate, updatedAppointments);
      }

      toast({
        title: 'Статус обновлен',
        description: `Запись ${selectedAppointment.client_name} теперь ${getStatusText(status)}`,
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить статус записи',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Получить текстовое представление статуса
  const getStatusText = (status: Appointment['status']) => {
    switch (status) {
      case 'pending': return 'В ожидании';
      case 'confirmed': return 'Подтверждена';
      case 'completed': return 'Завершена';
      case 'cancelled': return 'Отменена';
      default: return 'Неизвестно';
    }
  };

  // Получить цвет для статуса
  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'confirmed': return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'completed': return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'cancelled': return 'bg-red-100 text-red-800 hover:bg-red-200';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  // Анимации
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
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

  // Форматирование даты
  const formatDateForDisplay = (dateStr: string) => {
    const date = parseISO(dateStr);
    return format(date, 'd MMMM yyyy', { locale: ru });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-rose-700">Управление записями</h1>
          <p className="text-gray-500 mt-1">Просмотр и управление записями клиентов</p>
        </div>
      </div>

      {/* Строка поиска */}
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Поиск по имени, телефону или услуге..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Основное содержимое */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Календарь */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <CalendarIcon className="mr-2 h-5 w-5 text-rose-500" />
              Календарь записей
            </CardTitle>
            <CardDescription>
              Выберите дату для просмотра записей
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateChange}
              className="rounded-md border"
              locale={ru}
            />
          </CardContent>
          <CardFooter className="flex justify-between text-sm text-gray-500">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
              <span>Сегодня</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-rose-200 mr-1"></div>
              <span>Выбрано</span>
            </div>
          </CardFooter>
        </Card>

        {/* Список записей */}
        <Card className="lg:col-span-8">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <div className="flex items-center text-lg">
                <ClipboardList className="mr-2 h-5 w-5 text-rose-500" />
                {searchQuery ? (
                  <span>Результаты поиска</span>
                ) : (
                  <span>
                    Записи на {selectedDate ? formatDateForDisplay(format(selectedDate, 'yyyy-MM-dd')) : 'сегодня'}
                  </span>
                )}
              </div>
              {searchQuery && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('');
                    if (selectedDate) {
                      filterAppointmentsByDate(selectedDate);
                    }
                  }}
                >
                  Сбросить поиск
                </Button>
              )}
            </CardTitle>
            <CardDescription>
              {searchQuery ? (
                `Найдено ${filteredAppointments.length} записей`
              ) : (
                `${filteredAppointments.length} записей на выбранную дату`
              )}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
                <span className="ml-2 text-gray-600">Загрузка записей...</span>
              </div>
            ) : filteredAppointments.length > 0 ? (
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="space-y-4"
              >
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Время</TableHead>
                      <TableHead>Клиент</TableHead>
                      <TableHead>Услуга</TableHead>
                      <TableHead>Статус</TableHead>
                      <TableHead className="text-right">Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAppointments.map((appointment) => (
                      <motion.tr
                        key={appointment.id}
                        variants={item}
                        className="hover:bg-muted/50"
                      >
                        <TableCell className="font-medium">{appointment.appointment_time}</TableCell>
                        <TableCell>{appointment.client_name}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{appointment.service_name}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(appointment.status)}>
                            {getStatusText(appointment.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewAppointment(appointment)}
                          >
                            Подробнее
                          </Button>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </motion.div>
            ) : (
              <div className="text-center py-10">
                <AlertCircle className="mx-auto h-10 w-10 text-gray-300" />
                <h3 className="mt-4 text-lg font-medium">Записи не найдены</h3>
                <p className="mt-2 text-gray-500">
                  {searchQuery
                    ? 'Попробуйте изменить параметры поиска'
                    : 'На выбранную дату нет записей'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Диалог с деталями записи */}
      {selectedAppointment && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Информация о записи</DialogTitle>
              <DialogDescription>
                Подробная информация о записи клиента
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="flex items-center">
                <User className="h-5 w-5 text-gray-500 mr-2" />
                <div>
                  <p className="font-medium">{selectedAppointment.client_name}</p>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Phone className="h-4 w-4 mr-1" />
                    <span>{selectedAppointment.client_phone}</span>
                  </div>
                  {selectedAppointment.client_email && (
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Mail className="h-4 w-4 mr-1" />
                      <span>{selectedAppointment.client_email}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 py-2">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Дата записи</p>
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 text-gray-500 mr-2" />
                    <span>{formatDateForDisplay(selectedAppointment.appointment_date)}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Время</p>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-gray-500 mr-2" />
                    <span>{selectedAppointment.appointment_time}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1 py-2">
                <p className="text-sm text-gray-500">Услуга</p>
                <p className="font-medium">{selectedAppointment.service_name}</p>
              </div>

              {selectedAppointment.notes && (
                <div className="space-y-1 py-2">
                  <div className="flex items-center">
                    <MessageSquare className="h-4 w-4 text-gray-500 mr-2" />
                    <p className="text-sm text-gray-500">Примечания</p>
                  </div>
                  <p className="text-sm italic bg-gray-50 p-3 rounded-md">{selectedAppointment.notes}</p>
                </div>
              )}

              <div className="space-y-1 py-2">
                <p className="text-sm text-gray-500">Текущий статус</p>
                <Badge className={`${getStatusColor(selectedAppointment.status)} px-3 py-1`}>
                  {getStatusText(selectedAppointment.status)}
                </Badge>
              </div>

              <div className="border-t pt-4 mt-4">
                <p className="text-sm font-medium mb-2">Изменить статус:</p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200"
                    onClick={() => handleUpdateStatus('pending')}
                    disabled={selectedAppointment.status === 'pending' || isUpdating}
                  >
                    {isUpdating ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : null}
                    В ожидании
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200"
                    onClick={() => handleUpdateStatus('confirmed')}
                    disabled={selectedAppointment.status === 'confirmed' || isUpdating}
                  >
                    {isUpdating ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : null}
                    Подтвердить
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200"
                    onClick={() => handleUpdateStatus('completed')}
                    disabled={selectedAppointment.status === 'completed' || isUpdating}
                  >
                    {isUpdating ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : null}
                    Завершить
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-red-100 text-red-800 hover:bg-red-200 border-red-200"
                    onClick={() => handleUpdateStatus('cancelled')}
                    disabled={selectedAppointment.status === 'cancelled' || isUpdating}
                  >
                    {isUpdating ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : null}
                    Отменить
                  </Button>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Закрыть
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
