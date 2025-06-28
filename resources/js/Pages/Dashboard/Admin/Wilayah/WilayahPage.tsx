import React, { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import SegmenSection from '@/Components/Dashboard/Components/Admin/Segmen/SegmenSection';
import BlokSensusSection from '@/Components/Dashboard/Components/Admin/BlokSensus/BlokSensusSection';
import SlsSection from '@/Components/Dashboard/Components/Admin/Sls/SlsSection';
import ProvinsiSection from '@/Components/Dashboard/Components/Admin/Provinsi/ProvinsiSection';
import KabKotaSection from '@/Components/Dashboard/Components/Admin/KabKota/KabKotaSection';
import KecamatanSection from '@/Components/Dashboard/Components/Admin/Kecamatan/KecamatanSection';
import KelDesaSection from '@/Components/Dashboard/Components/Admin/KelDesa/KelDesaSection';
import { Card, CardContent, CardHeader } from '@/Components/ui/card';
import { PageProps, Provinsi, KabKota, Kecamatan, KelurahanDesa, Segmen, BlokSensus, Sls } from '@/types';

interface WilayahPageProps extends PageProps {
  activeTab: 'provinsi'|'kab-kota'|'kecamatan'|'kel-desa'|'segmen'|'blok-sensus'|'sls';
  provinsi: Provinsi[];
  kabKota: KabKota[];
  kecamatan: Kecamatan[];
  kelurahanDesa: KelurahanDesa[];
  segmen: Segmen[];
  blokSensus: BlokSensus[];
  sls: Sls[];
}

const WilayahPage: React.FC = () => {
  const {
    activeTab,
    provinsi,
    kabKota,
    kecamatan,
    kelurahanDesa,
    segmen,
    blokSensus,
    sls,
  } = usePage<WilayahPageProps>().props;

    // title mapping for each section
  const titleMap: Record<WilayahPageProps['activeTab'], string> = {
    'provinsi':    'Daftar Provinsi',
    'kab-kota':    'Daftar Kabupaten/Kota',
    'kecamatan':   'Daftar Kecamatan',
    'kel-desa':    'Daftar Kelurahan/Desa',
    'segmen':      'Daftar Segmen',
    'blok-sensus': 'Daftar Blok Sensus',
    'sls':         'Daftar SLS',
  };

  // local state mirror, so sections that allow editing can update
  const [segmenData, setSegmenData] = useState<Segmen[]>(segmen);
  const [blokData, setBlokData] = useState<BlokSensus[]>(blokSensus);
  const [slsData, setSlsData] = useState<Sls[]>(sls);

  // no need in‐state for provinsi/kab/kec because AddSegmenDialog now fetches them via AJAX
  // but if you still want to pass initial lists:
  const [provData, setProvData] = useState<Provinsi[]>(provinsi);
  const [kabData, setKabKotaData] = useState<KabKota[]>(kabKota);
  const [kecData, setKecData] = useState<Kecamatan[]>(kecamatan);
  const [kelDesa, setKelData] = useState<KelurahanDesa[]>(kelurahanDesa);

 // initialize state with props data
  useEffect(() => {
    setProvData(provinsi);
    setKabKotaData(kabKota);
    setKecData(kecamatan);
    setKelData(kelurahanDesa);
    setSegmenData(segmen);
    setBlokData(blokSensus);
    setSlsData(
    (sls ?? []).map((item: any) => ({
      id: item.id?.toString() || item.id_sls?.toString() || '', // fallback ke id_sls kalau ada
      nama_sls: item.nama_sls,
      bs_id: item.bs_id?.toString() || '',
    }))
  );
  }, [provinsi, kabKota, kecamatan, segmen, blokSensus, sls]);

  // pick which section to show based on activeTab
  const renderSection = () => {
    switch (activeTab) {
      case 'provinsi':
        return <ProvinsiSection provData={provData} />;
      case 'kab-kota':
        return <KabKotaSection kabKotaData={kabData} />;
      case 'kecamatan':
        return <KecamatanSection kecData={kecData} />;
      case 'kel-desa':
        return <KelDesaSection kelData={kelurahanDesa} />;
      case 'segmen':
        return (
          <SegmenSection
            provData={provData}
            kabKotaData={kabData}
            kecData={kecData}
            segmenData={segmenData}
            setSegmenData={setSegmenData}
            canEditDelete={true}
          />
        );
      case 'blok-sensus':
        return (
          <BlokSensusSection
            blokData={blokData}
            setBlokData={setBlokData}
            canEditDelete={true}
          />
        );
      case 'sls':
        return (
          <SlsSection
            slsData={slsData}
            setSlsData={setSlsData}
            canEditDelete={true}
          />
        );
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <Head title="Wilayah" />
            <Card className="w-full">
            <CardHeader className="flex flex-col items-center text-base sm:text-xl font-semibold justify-between">
                <h2 className="text-2xl font-semibold mb-6">
                    {titleMap[activeTab]}
                </h2>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="px-6 py-4">
                    {renderSection()}
                </div>
            </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default WilayahPage;
