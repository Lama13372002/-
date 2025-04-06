'use client';

import React from 'react';
import { HeroSection } from '@/components/home/HeroSection';
import { GalleryPreview } from '@/components/home/GalleryPreview';
import { ServicesPreview } from '@/components/home/ServicesPreview';
import { ReviewsSection } from '@/components/home/ReviewsSection';
import { MasterInfo } from '@/components/home/MasterInfo';
import { ContactSection } from '@/components/home/ContactSection';
import { AppointmentSection } from '@/components/home/AppointmentSection';

export default function Home() {
  return (
    <>
      {/* Главный контент */}
      <main>
        {/* Hero секция */}
        <HeroSection />

        {/* Секция услуг */}
        <ServicesPreview />

        {/* Секция галереи */}
        <GalleryPreview />

        {/* Секция о мастере */}
        <MasterInfo />

        {/* Секция отзывов */}
        <ReviewsSection />

        {/* Секция записи */}
        <AppointmentSection />

        {/* Секция контактов */}
        <ContactSection />
      </main>
    </>
  );
}
