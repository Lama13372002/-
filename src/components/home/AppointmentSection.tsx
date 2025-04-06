'use client';

import type React from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Calendar as CalendarIcon,
  Clock,
  Phone,
  Mail,
  User,
  CalendarCheck
} from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

// Временные данные для услуг (в реальном приложении получим из базы данных)
const demoServices = [
  { id: 1, name: 'Маникюр классический', price: 1200, duration: 60 },
  { id: 2, name: 'Маникюр аппаратный', price: 1500, duration: 75 },
  { id: 3, name: 'Гель-лак', price: 1800, duration: 90 },
  { id: 4, name: 'Педикюр классический', price: 1800, duration: 60 },
  { id: 5, name: 'Педикюр аппаратный', price: 2000, duration: 80 },
  { id: 6, name: 'Френч-дизайн', price: 500, duration: 30 },
  { id: 7, name: 'Стразы и декор', price: 50, duration: 15 },
  { id: 8, name: 'Парафинотерапия', price: 800, duration: 30 }
];

// Временные данные для временных слотов (в реальном приложении будут динамически генерироваться)
const timeSlots = [
  '10:00', '11:00', '12:00', '13:00', '14:00',
  '15:00', '16:00', '17:00', '18:00', '19:00'
];

export const AppointmentSection: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [service, setService] = useState<string>('');
  const [time, setTime] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !service || !time) {
      alert('Пожалуйста, заполните все обязательные поля');
      return;
    }

    // В реальном приложении здесь будет логика отправки данных на сервер
    const formattedDate = date ? format(date, 'dd.MM.yyyy', { locale: ru }) : '';
    alert(`Запись создана!\\nДата: ${formattedDate}\\nВремя: ${time}\\nУслуга: ${service}`);
  };

  // Получаем выбранную услугу
  const selectedService = demoServices.find(s => s.id.toString() === service);

  return (
    <section className="py-20 bg-gradient-to-b from-white to-rose-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-rose-900 mb-4">
            Онлайн-запись
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Запишитесь на удобное для вас время в несколько кликов
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Левая колонка */}
                  <div className="space-y-6">
                    {/* Выбор услуги */}
                    <div className="space-y-2">
                      <label htmlFor="service" className="block text-sm font-medium text-gray-700">
                        Услуга <span className="text-rose-500">*</span>
                      </label>
                      <Select value={service} onValueChange={setService}>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите услугу" />
                        </SelectTrigger>
                        <SelectContent>
                          {demoServices.map((service) => (
                            <SelectItem
                              key={service.id}
                              value={service.id.toString()}
                            >
                              {service.name} - {service.price} ₽
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Выбор даты */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Дата <span className="text-rose-500">*</span>
                      </label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal border-gray-300 bg-white hover:bg-gray-50"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4 text-rose-500" />
                            {date ? (
                              format(date, 'PPP', { locale: ru })
                            ) : (
                              <span className="text-gray-500">Выберите дату</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            fromDate={new Date()}
                            className="rounded-md"
                            locale={ru}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Выбор времени */}
                    <div className="space-y-2">
                      <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                        Время <span className="text-rose-500">*</span>
                      </label>
                      <Select value={time} onValueChange={setTime}>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите время" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((slot) => (
                            <SelectItem key={slot} value={slot}>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-2 text-rose-500" />
                                {slot}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Правая колонка */}
                  <div className="space-y-6">
                    {/* Имя */}
                    <div className="space-y-2">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Имя <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="name"
                          type="text"
                          placeholder="Ваше имя"
                          required
                          className="pl-10"
                        />
                      </div>
                    </div>

                    {/* Телефон */}
                    <div className="space-y-2">
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Телефон <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+7 (___) ___-__-__"
                          required
                          className="pl-10"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="Ваш email"
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Выбранная услуга - отображение информации */}
                {selectedService && (
                  <div className="bg-rose-50 p-4 rounded-lg">
                    <h4 className="font-medium text-rose-900 mb-2">Информация о записи:</h4>
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-700">
                      <p>Услуга: <span className="font-medium">{selectedService.name}</span></p>
                      <p>Стоимость: <span className="font-medium">{selectedService.price} ₽</span></p>
                      <p>Длительность: <span className="font-medium">{selectedService.duration} мин.</span></p>
                    </div>
                  </div>
                )}

                {/* Кнопка отправки */}
                <Button type="submit" className="w-full bg-rose-500 hover:bg-rose-600 py-6 text-lg">
                  <CalendarCheck className="mr-2 h-5 w-5" />
                  Записаться
                </Button>

                <p className="text-center text-sm text-gray-500">
                  Нажимая кнопку "Записаться", вы соглашаетесь с нашей{' '}
                  <a href="#" className="text-rose-600 hover:underline">
                    политикой конфиденциальности
                  </a>
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
