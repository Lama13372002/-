'use client';

import type React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send
} from 'lucide-react';

export const ContactSection: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // В реальном приложении здесь будет логика отправки формы
    alert('Сообщение отправлено!');
  };

  return (
    <section className="py-20 bg-rose-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-rose-900 mb-4">
            Контакты
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Свяжитесь с нами любым удобным способом или оставьте сообщение
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Контактная информация */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h3 className="text-2xl font-semibold text-rose-800 mb-6">Как нас найти</h3>

            <div className="space-y-6 mb-8">
              <div className="flex items-start">
                <div className="bg-white p-3 rounded-full mr-4">
                  <Phone className="h-6 w-6 text-rose-500" />
                </div>
                <div>
                  <p className="font-medium text-rose-900 mb-1">Телефон</p>
                  <a href="tel:+71234567890" className="text-gray-700 hover:text-rose-600 transition-colors">
                    +7 (123) 456-78-90
                  </a>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-white p-3 rounded-full mr-4">
                  <Mail className="h-6 w-6 text-rose-500" />
                </div>
                <div>
                  <p className="font-medium text-rose-900 mb-1">Email</p>
                  <a href="mailto:info@nailmaster.ru" className="text-gray-700 hover:text-rose-600 transition-colors">
                    info@nailmaster.ru
                  </a>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-white p-3 rounded-full mr-4">
                  <MapPin className="h-6 w-6 text-rose-500" />
                </div>
                <div>
                  <p className="font-medium text-rose-900 mb-1">Адрес</p>
                  <p className="text-gray-700">
                    г. Москва, ул. Примерная, д. 123
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-white p-3 rounded-full mr-4">
                  <Clock className="h-6 w-6 text-rose-500" />
                </div>
                <div>
                  <p className="font-medium text-rose-900 mb-1">Часы работы</p>
                  <p className="text-gray-700">
                    Пн-Пт: 10:00 - 20:00
                    <br />
                    Сб: 10:00 - 18:00
                    <br />
                    Вс: выходной
                  </p>
                </div>
              </div>
            </div>

            {/* Google Maps интеграция */}
            <div className="h-[300px] bg-white rounded-lg shadow-sm overflow-hidden">
              <iframe
                title="Карта расположения салона"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2245.5879977676396!2d37.61793491591701!3d55.75684998055641!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46b54a5adb3c1b2d%3A0xd9dda12c9b32dc8a!2z0JzQvtGB0LrQstCwLCDQoNC-0YHRgdC40Y8!5e0!3m2!1sru!2sru!4v1722787152771!5m2!1sru!2sru"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </motion.div>

          {/* Форма обратной связи */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h3 className="text-2xl font-semibold text-rose-800 mb-6">Напишите нам</h3>

            <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 rounded-lg shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Имя
                  </label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Ваше имя"
                    required
                    className="w-full"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Ваш email"
                    required
                    className="w-full"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Телефон
                </label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Ваш телефон"
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Сообщение
                </label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Ваше сообщение"
                  rows={5}
                  required
                  className="w-full"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <Button type="submit" className="w-full bg-rose-500 hover:bg-rose-600">
                  <Send className="h-4 w-4 mr-2" />
                  Отправить сообщение
                </Button>
                <Button type="button" variant="outline" className="w-full border-rose-300 text-rose-600 hover:bg-rose-50" asChild>
                  <Link href="/appointment">
                    Записаться онлайн
                  </Link>
                </Button>
              </div>

              <p className="text-xs text-gray-500 text-center">
                Нажимая кнопку "Отправить сообщение", вы соглашаетесь с нашей{" "}
                <a href="#" className="text-rose-600 hover:underline">политикой конфиденциальности</a>
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
