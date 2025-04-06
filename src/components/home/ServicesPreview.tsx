'use client';

import type React from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

// Временные данные для услуг (в реальном приложении будем получать из базы данных)
const serviceCategories = [
  { id: 'manicure', name: 'Маникюр' },
  { id: 'pedicure', name: 'Педикюр' },
  { id: 'design', name: 'Дизайн ногтей' },
  { id: 'care', name: 'Уход' }
];

const demoServices = [
  {
    id: 1,
    name: 'Маникюр классический',
    price: 1200,
    duration: 60,
    description: 'Обработка кутикулы, придание формы ногтям, полировка.',
    category: 'manicure'
  },
  {
    id: 2,
    name: 'Маникюр аппаратный',
    price: 1500,
    duration: 75,
    description: 'Бережная обработка кутикулы аппаратом, придание формы, полировка.',
    category: 'manicure'
  },
  {
    id: 3,
    name: 'Гель-лак',
    price: 1800,
    duration: 90,
    description: 'Маникюр + покрытие гель-лаком в один тон.',
    category: 'manicure'
  },
  {
    id: 4,
    name: 'Педикюр классический',
    price: 1800,
    duration: 60,
    description: 'Обработка стоп, придание формы ногтям.',
    category: 'pedicure'
  },
  {
    id: 5,
    name: 'Педикюр аппаратный',
    price: 2000,
    duration: 80,
    description: 'Аппаратная обработка стоп, бережный уход.',
    category: 'pedicure'
  },
  {
    id: 6,
    name: 'Френч-дизайн',
    price: 500,
    duration: 30,
    description: 'Классический французский маникюр.',
    category: 'design'
  },
  {
    id: 7,
    name: 'Стразы и декор',
    price: 50,
    duration: 15,
    description: 'Стоимость за 1 стразу или элемент декора.',
    category: 'design'
  },
  {
    id: 8,
    name: 'Парафинотерапия',
    price: 800,
    duration: 30,
    description: 'Теплая парафиновая маска для рук.',
    category: 'care'
  }
];

export const ServicesPreview: React.FC = () => {
  const [activeTab, setActiveTab] = useState(serviceCategories[0].id);

  // Получаем услуги по активной категории
  const filteredServices = demoServices.filter(service => service.category === activeTab).slice(0, 3);

  // Анимация для карточек
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1 + 0.3,
        duration: 0.5
      }
    })
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
            Услуги и цены
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Широкий спектр профессиональных услуг для красоты ваших ногтей
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-10"
        >
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full md:w-auto grid grid-cols-2 md:grid-cols-4 mb-8">
              {serviceCategories.map(category => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="data-[state=active]:bg-rose-500 data-[state=active]:text-white"
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {serviceCategories.map(category => (
              <TabsContent key={category.id} value={category.id} className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {filteredServices.map((service, i) => (
                    <motion.div
                      key={service.id}
                      custom={i}
                      variants={cardVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                    >
                      <Card className="h-full shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader>
                          <CardTitle className="flex justify-between items-center">
                            <span>{service.name}</span>
                            <span className="text-rose-500">{service.price} ₽</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600">{service.description}</p>
                          <div className="mt-4 bg-rose-50 text-rose-700 text-sm py-1 px-3 rounded-full inline-block">
                            {service.duration} мин
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button asChild className="w-full bg-rose-500 hover:bg-rose-600">
                            <Link href="/appointment">Записаться</Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center"
        >
          <Button variant="outline" asChild className="border-rose-300 text-rose-700 hover:bg-rose-100">
            <Link href="/services">Все услуги и цены</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
