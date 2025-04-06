'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import {
  Save,
  Upload,
  User,
  Mail,
  Phone,
  MapPin,
  Instagram,
  Facebook,
  Clock,
  Settings as SettingsIcon,
  X,
  Loader2
} from 'lucide-react';

interface MasterInfo {
  name: string;
  bio: string;
  experience: string;
  specialization: string;
  avatar_url: string;
}

interface SiteSettings {
  site_name: string;
  site_description: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  working_hours: string;
  instagram_url: string;
  facebook_url: string;
  vk_url: string;
  telegram_url: string;
  logo_url: string;
}

export default function SettingsPage() {
  const [masterInfo, setMasterInfo] = useState<MasterInfo>({
    name: 'Елена Иванова',
    bio: 'Опытный мастер маникюра и педикюра с более чем 5-летним стажем. Постоянно совершенствую свои навыки, посещаю мастер-классы и тренинги. Использую только качественные и безопасные материалы.',
    experience: '5 лет',
    specialization: 'Маникюр, педикюр, наращивание ногтей, дизайн',
    avatar_url: 'https://i.pravatar.cc/300?img=26'
  });

  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    site_name: 'NailMaster - Студия маникюра',
    site_description: 'Профессиональный маникюр, педикюр и дизайн ногтей',
    contact_email: 'info@nailmaster.ru',
    contact_phone: '+7 (999) 123-45-67',
    address: 'г. Москва, ул. Примерная, д. 123',
    working_hours: 'Пн-Пт: 10:00-20:00, Сб-Вс: 11:00-18:00',
    instagram_url: 'https://instagram.com/nailmaster',
    facebook_url: 'https://facebook.com/nailmaster',
    vk_url: 'https://vk.com/nailmaster',
    telegram_url: 'https://t.me/nailmaster',
    logo_url: ''
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('master');
  const masterAvatarInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);
  const [previewLogo, setPreviewLogo] = useState<string | null>(null);
  const { toast } = useToast();

  // Загрузка данных
  useEffect(() => {
    // Имитация загрузки данных с сервера
    const loadSettings = async () => {
      // В реальном приложении здесь будет API-запрос к /api/settings
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    };

    loadSettings();
  }, []);

  // Обработчик изменения аватара мастера
  const handleMasterAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
        setPreviewAvatar(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Обработчик изменения логотипа
  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
        setPreviewLogo(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Удаление предпросмотра аватара
  const handleRemoveAvatarPreview = () => {
    setPreviewAvatar(null);
    if (masterAvatarInputRef.current) {
      masterAvatarInputRef.current.value = '';
    }
  };

  // Удаление предпросмотра логотипа
  const handleRemoveLogoPreview = () => {
    setPreviewLogo(null);
    if (logoInputRef.current) {
      logoInputRef.current.value = '';
    }
  };

  // Сохранение информации о мастере
  const handleSaveMasterInfo = async () => {
    setIsSaving(true);
    try {
      // Валидация
      if (!masterInfo.name.trim()) {
        toast({
          title: 'Ошибка',
          description: 'Имя мастера обязательно для заполнения',
          variant: 'destructive',
        });
        setIsSaving(false);
        return;
      }

      // В реальном приложении здесь будет API-запрос для сохранения данных
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Обновляем аватар, если был выбран новый
      if (previewAvatar) {
        setMasterInfo({
          ...masterInfo,
          avatar_url: previewAvatar
        });
        setPreviewAvatar(null);
      }

      toast({
        title: 'Успешно',
        description: 'Информация о мастере успешно сохранена',
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить информацию о мастере',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Сохранение настроек сайта
  const handleSaveSiteSettings = async () => {
    setIsSaving(true);
    try {
      // Валидация
      if (!siteSettings.site_name.trim()) {
        toast({
          title: 'Ошибка',
          description: 'Название сайта обязательно для заполнения',
          variant: 'destructive',
        });
        setIsSaving(false);
        return;
      }

      // В реальном приложении здесь будет API-запрос для сохранения данных
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Обновляем логотип, если был выбран новый
      if (previewLogo) {
        setSiteSettings({
          ...siteSettings,
          logo_url: previewLogo
        });
        setPreviewLogo(null);
      }

      toast({
        title: 'Успешно',
        description: 'Настройки сайта успешно сохранены',
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить настройки сайта',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

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
          <h1 className="text-2xl font-bold text-rose-700">Настройки сайта</h1>
          <p className="text-gray-500 mt-1">Управление информацией о мастере и настройками сайта</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
          <span className="ml-2 text-lg text-gray-600">Загрузка настроек...</span>
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="master" className="flex items-center">
              <User className="w-4 h-4 mr-2" /> Информация о мастере
            </TabsTrigger>
            <TabsTrigger value="site" className="flex items-center">
              <SettingsIcon className="w-4 h-4 mr-2" /> Настройки сайта
            </TabsTrigger>
          </TabsList>

          {/* Информация о мастере */}
          <TabsContent value="master">
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Информация о мастере</CardTitle>
                  <CardDescription>
                    Персональная информация, которая будет отображаться в профиле мастера на сайте
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <motion.div variants={item} className="space-y-4">
                    {/* Аватар */}
                    <div>
                      <Label>Фото мастера</Label>
                      <div className="mt-2 flex items-center">
                        <div className="relative mr-4">
                          <img
                            src={previewAvatar || masterInfo.avatar_url}
                            alt="Avatar"
                            className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                          />
                          {(previewAvatar || masterInfo.avatar_url) && (
                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                              onClick={handleRemoveAvatarPreview}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                        <div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => masterAvatarInputRef.current?.click()}
                            className="mb-1"
                          >
                            <Upload className="w-4 h-4 mr-2" /> Загрузить фото
                          </Button>
                          <input
                            ref={masterAvatarInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleMasterAvatarChange}
                          />
                          <p className="text-xs text-gray-500">
                            JPG, PNG или GIF. Рекомендуемый размер 400x400px.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Имя */}
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="master-name" className="text-right">
                        Имя мастера
                      </Label>
                      <Input
                        id="master-name"
                        value={masterInfo.name}
                        onChange={(e) => setMasterInfo({ ...masterInfo, name: e.target.value })}
                        className="col-span-3"
                      />
                    </div>

                    {/* Опыт */}
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="master-experience" className="text-right">
                        Опыт работы
                      </Label>
                      <Input
                        id="master-experience"
                        value={masterInfo.experience}
                        onChange={(e) => setMasterInfo({ ...masterInfo, experience: e.target.value })}
                        className="col-span-3"
                        placeholder="Например: 5 лет"
                      />
                    </div>

                    {/* Специализация */}
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="master-specialization" className="text-right">
                        Специализация
                      </Label>
                      <Input
                        id="master-specialization"
                        value={masterInfo.specialization}
                        onChange={(e) => setMasterInfo({ ...masterInfo, specialization: e.target.value })}
                        className="col-span-3"
                        placeholder="Например: Маникюр, педикюр, наращивание"
                      />
                    </div>

                    {/* Биография */}
                    <div className="grid grid-cols-4 items-start gap-4">
                      <Label htmlFor="master-bio" className="text-right">
                        О себе
                      </Label>
                      <Textarea
                        id="master-bio"
                        value={masterInfo.bio}
                        onChange={(e) => setMasterInfo({ ...masterInfo, bio: e.target.value })}
                        className="col-span-3"
                        rows={5}
                      />
                    </div>
                  </motion.div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button
                    onClick={handleSaveMasterInfo}
                    className="bg-rose-500 hover:bg-rose-600 text-white"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Сохранение...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Сохранить
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Настройки сайта */}
          <TabsContent value="site">
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Основные настройки</CardTitle>
                  <CardDescription>
                    Основная информация о сайте и контактные данные
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <motion.div variants={item} className="space-y-4">
                    {/* Логотип */}
                    <div>
                      <Label>Логотип сайта</Label>
                      <div className="mt-2 flex items-center">
                        {(previewLogo || siteSettings.logo_url) ? (
                          <div className="relative mr-4">
                            <img
                              src={previewLogo || siteSettings.logo_url}
                              alt="Logo"
                              className="h-12 object-contain border rounded p-1"
                            />
                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                              onClick={handleRemoveLogoPreview}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <div className="w-12 h-12 bg-gray-100 flex items-center justify-center rounded mr-4">
                            <SettingsIcon className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => logoInputRef.current?.click()}
                            className="mb-1"
                          >
                            <Upload className="w-4 h-4 mr-2" /> Загрузить логотип
                          </Button>
                          <input
                            ref={logoInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleLogoChange}
                          />
                          <p className="text-xs text-gray-500">
                            JPG, PNG или SVG. Рекомендуемая высота 60px.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Название сайта */}
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="site-name" className="text-right">
                        Название сайта
                      </Label>
                      <Input
                        id="site-name"
                        value={siteSettings.site_name}
                        onChange={(e) => setSiteSettings({ ...siteSettings, site_name: e.target.value })}
                        className="col-span-3"
                      />
                    </div>

                    {/* Описание */}
                    <div className="grid grid-cols-4 items-start gap-4">
                      <Label htmlFor="site-description" className="text-right">
                        Описание сайта
                      </Label>
                      <Textarea
                        id="site-description"
                        value={siteSettings.site_description}
                        onChange={(e) => setSiteSettings({ ...siteSettings, site_description: e.target.value })}
                        className="col-span-3"
                        rows={2}
                        placeholder="Краткое описание для SEO и мета-тегов"
                      />
                    </div>

                    {/* Email */}
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="contact-email" className="text-right">
                        Email
                      </Label>
                      <div className="col-span-3 flex items-center">
                        <Mail className="w-4 h-4 text-gray-400 mr-2" />
                        <Input
                          id="contact-email"
                          value={siteSettings.contact_email}
                          onChange={(e) => setSiteSettings({ ...siteSettings, contact_email: e.target.value })}
                          placeholder="example@mail.com"
                        />
                      </div>
                    </div>

                    {/* Телефон */}
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="contact-phone" className="text-right">
                        Телефон
                      </Label>
                      <div className="col-span-3 flex items-center">
                        <Phone className="w-4 h-4 text-gray-400 mr-2" />
                        <Input
                          id="contact-phone"
                          value={siteSettings.contact_phone}
                          onChange={(e) => setSiteSettings({ ...siteSettings, contact_phone: e.target.value })}
                          placeholder="+7 (999) 123-45-67"
                        />
                      </div>
                    </div>

                    {/* Адрес */}
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="address" className="text-right">
                        Адрес
                      </Label>
                      <div className="col-span-3 flex items-center">
                        <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                        <Input
                          id="address"
                          value={siteSettings.address}
                          onChange={(e) => setSiteSettings({ ...siteSettings, address: e.target.value })}
                          placeholder="г. Москва, ул. Примерная, д. 123"
                        />
                      </div>
                    </div>

                    {/* Часы работы */}
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="working-hours" className="text-right">
                        Часы работы
                      </Label>
                      <div className="col-span-3 flex items-center">
                        <Clock className="w-4 h-4 text-gray-400 mr-2" />
                        <Input
                          id="working-hours"
                          value={siteSettings.working_hours}
                          onChange={(e) => setSiteSettings({ ...siteSettings, working_hours: e.target.value })}
                          placeholder="Пн-Пт: 10:00-20:00, Сб-Вс: 11:00-18:00"
                        />
                      </div>
                    </div>
                  </motion.div>
                </CardContent>
              </Card>

              <motion.div variants={item}>
                <Card>
                  <CardHeader>
                    <CardTitle>Социальные сети</CardTitle>
                    <CardDescription>
                      Ссылки на профили в социальных сетях
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Instagram */}
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="instagram-url" className="text-right">
                        Instagram
                      </Label>
                      <div className="col-span-3 flex items-center">
                        <Instagram className="w-4 h-4 text-gray-400 mr-2" />
                        <Input
                          id="instagram-url"
                          value={siteSettings.instagram_url}
                          onChange={(e) => setSiteSettings({ ...siteSettings, instagram_url: e.target.value })}
                          placeholder="https://instagram.com/username"
                        />
                      </div>
                    </div>

                    {/* Facebook */}
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="facebook-url" className="text-right">
                        Facebook
                      </Label>
                      <div className="col-span-3 flex items-center">
                        <Facebook className="w-4 h-4 text-gray-400 mr-2" />
                        <Input
                          id="facebook-url"
                          value={siteSettings.facebook_url}
                          onChange={(e) => setSiteSettings({ ...siteSettings, facebook_url: e.target.value })}
                          placeholder="https://facebook.com/username"
                        />
                      </div>
                    </div>

                    {/* VK */}
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="vk-url" className="text-right">
                        ВКонтакте
                      </Label>
                      <div className="col-span-3 flex items-center">
                        <span className="w-4 h-4 flex items-center justify-center text-gray-400 mr-2">
                          ВК
                        </span>
                        <Input
                          id="vk-url"
                          value={siteSettings.vk_url}
                          onChange={(e) => setSiteSettings({ ...siteSettings, vk_url: e.target.value })}
                          placeholder="https://vk.com/username"
                        />
                      </div>
                    </div>

                    {/* Telegram */}
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="telegram-url" className="text-right">
                        Telegram
                      </Label>
                      <div className="col-span-3 flex items-center">
                        <span className="w-4 h-4 flex items-center justify-center text-gray-400 mr-2">
                          Tg
                        </span>
                        <Input
                          id="telegram-url"
                          value={siteSettings.telegram_url}
                          onChange={(e) => setSiteSettings({ ...siteSettings, telegram_url: e.target.value })}
                          placeholder="https://t.me/username"
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button
                      onClick={handleSaveSiteSettings}
                      className="bg-rose-500 hover:bg-rose-600 text-white"
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Сохранение...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Сохранить настройки
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            </motion.div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
