import React, { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Card, CardContent, CardHeader } from '@/Components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/Components/ui/tabs';
import { PageProps, Segmen, BlokSensus, Sls } from '@/types'; // Pastikan definisi interface di file types
import SegmenSection from '@/Components/Dashboard/Components/Admin/Segmen/SegmenSection';
import BlokSensusSection from '@/Components/Dashboard/Components/Admin/BlokSensus/BlokSensusSection';
import SlsSection from '@/Components/Dashboard/Components/Admin/Sls/SlsSection';


interface SegmenBlokSensusProps extends PageProps {
  csrf_token: string;
  segmen: Segmen[];
  blokSensus: BlokSensus[];
  sls: Sls[];
}

const SegmenBlokSensusPage: React.FC = () => {
  // Ambil data dari Inertia
  const { segmen, blokSensus, sls } = usePage<SegmenBlokSensusProps>().props as SegmenBlokSensusProps;

  // State data
  const [segmenData, setSegmenData] = useState<Segmen[]>([]);
  const [blokData, setBlokData] = useState<BlokSensus[]>([]);
  const [slsData, setSlsData] = useState<Sls[]>([]);

  // Tab aktif
  const [activeTab, setActiveTab] = useState<'segmen' | 'blokSensus' | 'sls'>('segmen');

  // Sinkronisasi data props -> state
  useEffect(() => {
    setSegmenData(segmen);
    setBlokData(blokSensus);
    setSlsData(sls);
  }, [segmen, blokSensus, sls]);

  // Karena properti auth tidak ada, tetapkan canEditDelete default (misal: true)
  const canEditDelete = true;

  return (
    <DashboardLayout>
      <Head title="Segmen & Blok Sensus" />

      <Card className="w-full shadow-md overflow-x-auto">
        <CardContent className="space-y-4 pt-6">
          <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as any)}>
            <TabsList className="mb-4 mt-2">
              <TabsTrigger value="segmen">Segmen</TabsTrigger>
              <TabsTrigger value="blokSensus">Blok Sensus</TabsTrigger>
              <TabsTrigger value="sls">SLS</TabsTrigger>
            </TabsList>

          {/* Dynamics Header Card */} 
            <CardHeader className="flex flex-col items-center text-base sm:text-xl font-semibold justify-between">
              <h2>
                {activeTab === 'segmen' && 'Daftar Segmen'}
                {activeTab === 'blokSensus' && 'Daftar Blok Sensus'}
                {activeTab === 'sls' && 'Daftar SLS'}
              </h2>
            </CardHeader>

            {/* Tab Segmen */}
            <TabsContent value="segmen">
              <SegmenSection
                segmenData={segmenData}
                setSegmenData={setSegmenData}
                canEditDelete={canEditDelete}
              />
            </TabsContent>

            {/* Tab Blok Sensus */}
            <TabsContent value="blokSensus">
              <BlokSensusSection
                blokData={blokData}
                setBlokData={setBlokData}
                canEditDelete={canEditDelete}
              />
            </TabsContent>

            {/* Tab SLS */}
            <TabsContent value="sls">
              <SlsSection
                slsData={slsData}
                setSlsData={setSlsData}
                canEditDelete={canEditDelete}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default SegmenBlokSensusPage;
