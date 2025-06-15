import React, { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Card, CardContent, CardHeader } from '@/Components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/Components/ui/tabs';
import { PageProps, Provinsi, KabKota, Kecamatan, KelurahanDesa, Segmen, BlokSensus, Sls } from '@/types'; // Pastikan definisi interface di file types
import SegmenSection from '@/Components/Dashboard/Components/Admin/Segmen/SegmenSection';
import BlokSensusSection from '@/Components/Dashboard/Components/Admin/BlokSensus/BlokSensusSection';
import SlsSection from '@/Components/Dashboard/Components/Admin/Sls/SlsSection';


interface WilayahProps extends PageProps {
  csrf_token: string;
  provinsi: Provinsi[];
  kabKota: KabKota[];
  kecamatan: Kecamatan[];
  kelurahanDesa: KelurahanDesa[];
  segmen: Segmen[];
  blokSensus: BlokSensus[];
  sls: Sls[];
}

const WilayahPage: React.FC = () => {
  // Ambil data dari Inertia
  const { provinsi, kabKota, kecamatan, kelurahanDesa, segmen, blokSensus, sls } = usePage<WilayahProps>().props as WilayahProps;

  // State data (jika perlu filtering/cascading)
  const [provData, setProvData] = useState<Provinsi[]>([]);
  const [kabKotaData, setKabKotaData] = useState<KabKota[]>([]);
  const [kecData, setKecData] = useState<Kecamatan[]>([]);
  const [kelData, setKelData] = useState<KelurahanDesa[]>([]);

  // State data
  const [segmenData, setSegmenData] = useState<Segmen[]>([]);
  const [blokData, setBlokData] = useState<BlokSensus[]>([]);
  const [slsData, setSlsData] = useState<Sls[]>([]);

  // Tab aktif
  const [activeTab1, setActiveTab1] = useState<'prov' | 'kab-kota' | 'kec' | 'kel-desa'>('prov');
  const [activeTab2, setActiveTab2] = useState<'segmen' | 'blokSensus' | 'sls'>('segmen');

  // Sinkronisasi data props -> state
  useEffect(() => {
    setProvData(provinsi);
    setKabKotaData(kabKota);
    setKecData(kecamatan);
    setKelData(kelurahanDesa);
    setSegmenData(segmen);
    setBlokData(blokSensus);
    setSlsData(
    sls.map((item: any) => ({
      id: item.id?.toString() || item.id_sls?.toString() || '', // fallback ke id_sls kalau ada
      nama_sls: item.nama_sls,
      bs_id: item.bs_id?.toString() || '',
    }))
  );
  }, [segmen, blokSensus, sls]);

  // Karena properti auth tidak ada, tetapkan canEditDelete default (misal: true)
  const canEditDelete = true;

  return (
    <DashboardLayout>
      <Head title="Wilayah" />
      <div className="flex flex-col gap-2">
        <Card className="w-full shadow-md overflow-x-auto">
            <CardContent className="space-y-4 pt-6">
            <Tabs value={activeTab1} onValueChange={(val) => setActiveTab1(val as any)}>
                <TabsList className="mb-4 mt-2">
                <TabsTrigger value="prov">Provinsi</TabsTrigger>
                <TabsTrigger value="kab-kota">Kab/Kota</TabsTrigger>
                <TabsTrigger value="kec">Kecamatan</TabsTrigger>
                <TabsTrigger value="kel-desa">Kelurahan/Desa</TabsTrigger>
                </TabsList>

            {/* Dynamics Header Card */}
                <CardHeader className="flex flex-col items-center text-base sm:text-xl font-semibold justify-between">
                <h2>
                    {activeTab1 === 'prov' && 'Daftar Provinsi'}
                    {activeTab1 === 'kab-kota' && 'Daftar Kabupaten/Kota'}
                    {activeTab1 === 'kec' && 'Daftar Kecamatan'}
                    {activeTab1 === 'kel-desa' && 'Daftar Kelurahan/Desa'}
                </h2>
                </CardHeader>

                <TabsContent value="prov">
                    <div>
                    {provData.map((prov) => (
                        <div key={prov.kode_provinsi} className="border-b p-2">{prov.nama_provinsi} ({prov.kode_provinsi})</div>
                    ))}
                    </div>
                </TabsContent>
                <TabsContent value="kab-kota">
                    <div>
                    {kabKotaData.map((kabKota) => (
                        <div key={kabKota.id} className="border-b p-2">{kabKota.nama_kab_kota} ({kabKota.id})</div>
                    ))}
                    </div>
                </TabsContent>
                <TabsContent value="kec">
                    <div>
                    {kecData.map((kec) => (
                        <div key={kec.id} className="border-b p-2">{kec.nama_kecamatan} ({kec.kode_kecamatan})</div>
                    ))}
                    </div>
                </TabsContent>
                <TabsContent value="kel-desa">
                    <div>
                    {kelData.map((kel) => (
                        <div key={kel.id} className="border-b p-2">{kel.nama_kel_desa} ({kel.kode_kel_desa})</div>
                    ))}
                    </div>
                </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
        <Card className="w-full shadow-md overflow-x-auto">
            <CardContent className="space-y-4 pt-6">
            <Tabs value={activeTab2} onValueChange={(val) => setActiveTab2(val as any)}>
                <TabsList className="mb-4 mt-2">
                <TabsTrigger value="segmen">Segmen</TabsTrigger>
                <TabsTrigger value="blokSensus">Blok Sensus</TabsTrigger>
                <TabsTrigger value="sls">SLS</TabsTrigger>
                </TabsList>

            {/* Dynamics Header Card */}
                <CardHeader className="flex flex-col items-center text-base sm:text-xl font-semibold justify-between">
                <h2>
                    {activeTab2 === 'segmen' && 'Daftar Segmen'}
                    {activeTab2 === 'blokSensus' && 'Daftar Blok Sensus'}
                    {activeTab2 === 'sls' && 'Daftar SLS'}
                </h2>
                </CardHeader>

                {/* Tab Segmen */}
                <TabsContent value="segmen">
                    <SegmenSection
                        provData={provData}
                        kabKotaData={kabKotaData}
                        kecData={kecData}
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
      </div>
    </DashboardLayout>
  );
};

export default WilayahPage;
