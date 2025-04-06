import type React from 'react';
import Link from 'next/link';
import { Instagram, Facebook, Phone, Mail, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-rose-50 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Логотип и краткая информация */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center mb-4">
              <div className="relative h-10 w-10 bg-rose-100 rounded-full flex items-center justify-center mr-3">
                <div className="h-7 w-7 bg-rose-400 rounded-full flex items-center justify-center text-white text-base font-semibold">
                  N
                </div>
              </div>
              <div className="text-rose-900 font-semibold text-lg">
                NailMaster
              </div>
            </div>
            <p className="text-gray-600 mb-4">
              Профессиональный уход за ногтями и стильные дизайны, которые подчеркнут вашу индивидуальность.
            </p>
            <div className="flex space-x-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-rose-200 hover:bg-rose-300 text-rose-700 p-2 rounded-full transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-rose-200 hover:bg-rose-300 text-rose-700 p-2 rounded-full transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Навигация */}
          <div className="col-span-1">
            <h3 className="text-rose-900 font-semibold text-lg mb-4">Навигация</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-600 hover:text-rose-600 transition-colors">
                  Главная
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-600 hover:text-rose-600 transition-colors">
                  Услуги
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-gray-600 hover:text-rose-600 transition-colors">
                  Галерея работ
                </Link>
              </li>
              <li>
                <Link href="/reviews" className="text-gray-600 hover:text-rose-600 transition-colors">
                  Отзывы
                </Link>
              </li>
              <li>
                <Link href="/contacts" className="text-gray-600 hover:text-rose-600 transition-colors">
                  Контакты
                </Link>
              </li>
            </ul>
          </div>

          {/* Контактная информация */}
          <div className="col-span-1">
            <h3 className="text-rose-900 font-semibold text-lg mb-4">Контакты</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Phone className="h-5 w-5 text-rose-500 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <a href="tel:+71234567890" className="text-gray-600 hover:text-rose-600 transition-colors">
                    +7 (123) 456-78-90
                  </a>
                </div>
              </li>
              <li className="flex items-start">
                <Mail className="h-5 w-5 text-rose-500 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <a href="mailto:info@nailmaster.ru" className="text-gray-600 hover:text-rose-600 transition-colors">
                    info@nailmaster.ru
                  </a>
                </div>
              </li>
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-rose-500 mt-0.5 mr-2 flex-shrink-0" />
                <div className="text-gray-600">
                  г. Москва, ул. Примерная, д. 123
                </div>
              </li>
              <li className="flex items-start">
                <Clock className="h-5 w-5 text-rose-500 mt-0.5 mr-2 flex-shrink-0" />
                <div className="text-gray-600">
                  Пн-Пт: 10:00 - 20:00
                  <br />
                  Сб: 10:00 - 18:00
                  <br />
                  Вс: выходной
                </div>
              </li>
            </ul>
          </div>

          {/* Форма подписки */}
          <div className="col-span-1">
            <h3 className="text-rose-900 font-semibold text-lg mb-4">Подписка на новости</h3>
            <p className="text-gray-600 mb-4">
              Подпишитесь, чтобы получать информацию о новых акциях и скидках
            </p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Ваш Email"
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent"
                required
              />
              <Button type="submit" className="w-full bg-rose-500 hover:bg-rose-600">
                Подписаться
              </Button>
            </form>
          </div>
        </div>

        {/* Разделитель */}
        <div className="border-t border-gray-200 mt-12 pt-8 text-center text-gray-500 text-sm">
          <p>© {currentYear} NailMaster. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};
