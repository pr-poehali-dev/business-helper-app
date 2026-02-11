import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BannersManager from '@/components/admin/BannersManager';
import PartnersManager from '@/components/admin/PartnersManager';
import AdsManager from '@/components/admin/AdsManager';
import StatsOverview from '@/components/admin/StatsOverview';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      
      <main className="container mx-auto px-4 py-8 mt-20">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Панель управления рекламой</h1>
          <p className="text-gray-600">Управление баннерами, партнерами и рекламными материалами</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview">Обзор</TabsTrigger>
            <TabsTrigger value="banners">Баннеры</TabsTrigger>
            <TabsTrigger value="partners">Партнеры</TabsTrigger>
            <TabsTrigger value="ads">Объявления</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <StatsOverview />
          </TabsContent>

          <TabsContent value="banners">
            <BannersManager />
          </TabsContent>

          <TabsContent value="partners">
            <PartnersManager />
          </TabsContent>

          <TabsContent value="ads">
            <AdsManager />
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default Admin;
