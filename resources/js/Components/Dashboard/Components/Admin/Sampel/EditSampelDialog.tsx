import { useState, useEffect, FormEventHandler } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { usePage, useForm } from '@inertiajs/react';
import { Loader2 } from "lucide-react";
import { Sampel, WithCsrf, PageProps } from '@/types';

/** Buat tipe union untuk enum */
type JenisSampel = "Utama" | "Cadangan";
type JenisTanaman = "Padi" | "Palawija";
interface SampelFormData extends Sampel, WithCsrf {}

interface EditSampelDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: SampelFormData) => Promise<void>;
  data: Sampel;
}

export const EditSampelDialog = ({
  isOpen,
  onClose,
  onSave,
  data
}: EditSampelDialogProps) => {
  const { csrf_token } = usePage<PageProps>().props;

  // State untuk setiap kolom di tabel sampel
  const [jenisSampel, setJenisSampel] = useState<JenisSampel>(data.jenis_sampel as JenisSampel);
  const [jenisTanaman, setJenisTanaman] = useState<JenisTanaman>(data.jenis_tanaman as JenisTanaman);
  const [frameKsa, setFrameKsa] = useState(data.frame_ksa ?? "");
  const [prov, setProv] = useState(data.prov);
  const [kab, setKab] = useState(data.kab);
  const [kec, setKec] = useState(data.kec);
  const [namaProv, setNamaProv] = useState(data.nama_prov);
  const [namaKab, setNamaKab] = useState(data.nama_kab);
  const [namaKec, setNamaKec] = useState(data.nama_kec);
  const [namaLok, setNamaLok] = useState(data.nama_lok);
  const [segmenId, setSegmenId] = useState<number | null | undefined>(data.segmen_id ?? undefined);
  const [subsegmen, setSubsegmen] = useState(data.subsegmen);
  const [strata, setStrata] = useState(data.strata);
  const [bulanListing, setBulanListing] = useState(data.bulan_listing);
  const [tahunListing, setTahunListing] = useState(data.tahun_listing);
  const [faseTanam, setFaseTanam] = useState(data.fase_tanam ?? "");
  const [rilis, setRilis] = useState(data.rilis ?? "");
  const [aRandom, setARandom] = useState(data.a_random ?? "");
  const [nks, setNks] = useState(data.nks);
  const [longVal, setLongVal] = useState(data.long);
  const [latVal, setLatVal] = useState(data.lat);
  const [subround, setSubround] = useState(data.subround);
  const [pclId, setPclId] = useState<number | undefined>(data.pcl_id ?? undefined);
  const [timId, setTimId] = useState<number | undefined>(data.tim_id ?? undefined);

  // Gunakan useForm untuk menangani error dan processing state
  const { processing, errors } = useForm<SampelFormData>({
    ...data,
    _token: csrf_token
  });

  useEffect(() => {
    if (isOpen) {
      setJenisSampel(data.jenis_sampel as JenisSampel);
      setJenisTanaman(data.jenis_tanaman as JenisTanaman);
      setFrameKsa(data.frame_ksa ?? "");
      setProv(data.prov);
      setKab(data.kab);
      setKec(data.kec);
      setNamaProv(data.nama_prov);
      setNamaKab(data.nama_kab);
      setNamaKec(data.nama_kec);
      setNamaLok(data.nama_lok);
      setSegmenId(data.segmen_id ?? undefined);
      setSubsegmen(data.subsegmen);
      setStrata(data.strata);
      setBulanListing(data.bulan_listing);
      setTahunListing(data.tahun_listing);
      setFaseTanam(data.fase_tanam ?? "");
      setRilis(data.rilis ?? "");
      setARandom(data.a_random ?? "");
      setNks(data.nks);
      setLongVal(data.long);
      setLatVal(data.lat);
      setSubround(data.subround);
    //   setPclId(data.pcl_id);
    //   setTimId(data.tim_id);
    }
  }, [isOpen, data]);

  const handleSubmit: FormEventHandler = async (e) => {
    e.preventDefault();
    try {
      await onSave({
        id: data.id,
        jenis_sampel: jenisSampel,
        jenis_tanaman: jenisTanaman,
        frame_ksa: frameKsa,
        prov,
        kab,
        kec,
        nama_prov: namaProv,
        nama_kab: namaKab,
        nama_kec: namaKec,
        nama_lok: namaLok,
        segmen_id: segmenId,
        subsegmen,
        strata,
        bulan_listing: bulanListing,
        tahun_listing: tahunListing,
        fase_tanam: faseTanam,
        rilis,
        a_random: aRandom,
        nks,
        long: longVal,
        lat: latVal,
        subround,
        // pcl_id: pclId,
        // tim_id: timId,
        _token: csrf_token
      });
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Sampel</DialogTitle>
          <DialogDescription>Edit data sampel</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input type="hidden" name="_token" value={csrf_token} />

         {/* Jenis Sampel -> Dropdown */}
         <div className="flex flex-col space-y-2">
            <Label htmlFor="jenis_sampel">Jenis Sampel</Label>
            <select
              id="jenis_sampel"
              name="jenis_sampel"
              className="border border-gray-300 rounded px-3 py-2"
              value={jenisSampel}
              onChange={(e) => setJenisSampel(e.target.value as "Utama" | "Cadangan")}
            >
              <option value="Utama">Utama</option>
              <option value="Cadangan">Cadangan</option>
            </select>
            {errors.jenis_sampel && (
              <p className="text-red-500 text-sm">{errors.jenis_sampel}</p>
            )}
          </div>

          {/* Jenis Tanaman -> Dropdown */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="jenis_tanaman">Jenis Tanaman</Label>
            <select
              id="jenis_tanaman"
              name="jenis_tanaman"
              className="border border-gray-300 rounded px-3 py-2"
              value={jenisTanaman}
              onChange={(e) => setJenisTanaman(e.target.value as "Padi" | "Palawija")}
            >
              <option value="Padi">Padi</option>
              <option value="Palawija">Palawija</option>
            </select>
            {errors.jenis_tanaman && (
              <p className="text-red-500 text-sm">{errors.jenis_tanaman}</p>
            )}
          </div>

          {/* Frame KSA */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="frame_ksa">Frame KSA</Label>
            <Input
              id="frame_ksa"
              name="frame_ksa"
              value={frameKsa}
              onChange={(e) => setFrameKsa(e.target.value)}
            />
            {errors.frame_ksa && (
              <p className="text-red-500 text-sm">{errors.frame_ksa}</p>
            )}
          </div>

          {/* Provinsi */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="prov">Provinsi</Label>
            <Input
              id="prov"
              name="prov"
              value={prov}
              onChange={(e) => setProv(e.target.value)}
            />
            {errors.prov && (
              <p className="text-red-500 text-sm">{errors.prov}</p>
            )}
          </div>

          {/* Kabupaten */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="kab">Kabupaten</Label>
            <Input
              id="kab"
              name="kab"
              value={kab}
              onChange={(e) => setKab(e.target.value)}
            />
            {errors.kab && (
              <p className="text-red-500 text-sm">{errors.kab}</p>
            )}
          </div>

          {/* Kecamatan */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="kec">Kecamatan</Label>
            <Input
              id="kec"
              name="kec"
              value={kec}
              onChange={(e) => setKec(e.target.value)}
            />
            {errors.kec && (
              <p className="text-red-500 text-sm">{errors.kec}</p>
            )}
          </div>

          {/* Nama Provinsi */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="nama_prov">Nama Provinsi</Label>
            <Input
              id="nama_prov"
              name="nama_prov"
              value={namaProv}
              onChange={(e) => setNamaProv(e.target.value)}
            />
            {errors.nama_prov && (
              <p className="text-red-500 text-sm">{errors.nama_prov}</p>
            )}
          </div>

          {/* Nama Kabupaten */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="nama_kab">Nama Kabupaten</Label>
            <Input
              id="nama_kab"
              name="nama_kab"
              value={namaKab}
              onChange={(e) => setNamaKab(e.target.value)}
            />
            {errors.nama_kab && (
              <p className="text-red-500 text-sm">{errors.nama_kab}</p>
            )}
          </div>

          {/* Nama Kecamatan */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="nama_kec">Nama Kecamatan</Label>
            <Input
              id="nama_kec"
              name="nama_kec"
              value={namaKec}
              onChange={(e) => setNamaKec(e.target.value)}
            />
            {errors.nama_kec && (
              <p className="text-red-500 text-sm">{errors.nama_kec}</p>
            )}
          </div>

          {/* Nama Lokasi */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="nama_lok">Nama Lokasi</Label>
            <Input
              id="nama_lok"
              name="nama_lok"
              value={namaLok}
              onChange={(e) => setNamaLok(e.target.value)}
            />
            {errors.nama_lok && (
              <p className="text-red-500 text-sm">{errors.nama_lok}</p>
            )}
          </div>

          {/* Segmen ID */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="segmen_id">Segmen ID</Label>
            <Input
              id="segmen_id"
              name="segmen_id"
              value={segmenId ?? ""}
              onChange={(e) => setSegmenId(e.target.value ? Number(e.target.value) : undefined)}
            />
            {errors.segmen_id && (
              <p className="text-red-500 text-sm">{errors.segmen_id}</p>
            )}
          </div>

          {/* Subsegmen */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="subsegmen">Subsegmen</Label>
            <Input
              id="subsegmen"
              name="subsegmen"
              value={subsegmen ?? ""}
              onChange={(e) => setSubsegmen(e.target.value)}
            />
            {errors.subsegmen && (
              <p className="text-red-500 text-sm">{errors.subsegmen}</p>
            )}
          </div>

          {/* Strata */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="strata">Strata</Label>
            <Input
              id="strata"
              name="strata"
              value={strata ?? ""}
              onChange={(e) => setStrata(e.target.value)}
            />
            {errors.strata && (
              <p className="text-red-500 text-sm">{errors.strata}</p>
            )}
          </div>

          {/* Bulan Listing */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="bulan_listing">Bulan Listing</Label>
            <Input
              id="bulan_listing"
              name="bulan_listing"
              value={bulanListing}
              onChange={(e) => setBulanListing(e.target.value)}
            />
            {errors.bulan_listing && (
              <p className="text-red-500 text-sm">{errors.bulan_listing}</p>
            )}
          </div>

          {/* Tahun Listing */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="tahun_listing">Tahun Listing</Label>
            <Input
              id="tahun_listing"
              name="tahun_listing"
              value={tahunListing}
              onChange={(e) => setTahunListing(e.target.value)}
            />
            {errors.tahun_listing && (
              <p className="text-red-500 text-sm">{errors.tahun_listing}</p>
            )}
          </div>

          {/* Fase Tanam */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="fase_tanam">Fase Tanam</Label>
            <Input
              id="fase_tanam"
              name="fase_tanam"
              value={faseTanam}
              onChange={(e) => setFaseTanam(e.target.value)}
            />
            {errors.fase_tanam && (
              <p className="text-red-500 text-sm">{errors.fase_tanam}</p>
            )}
          </div>

          {/* Rilis (Tanggal) */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="rilis">Tanggal Rilis</Label>
            <Input
              id="rilis"
              name="rilis"
              type="date"
              value={rilis}
              onChange={(e) => setRilis(e.target.value)}
            />
            {errors.rilis && (
              <p className="text-red-500 text-sm">{errors.rilis}</p>
            )}
          </div>

          {/* A Random */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="a_random">A Random</Label>
            <Input
              id="a_random"
              name="a_random"
              value={aRandom}
              onChange={(e) => setARandom(e.target.value)}
            />
            {errors.a_random && (
              <p className="text-red-500 text-sm">{errors.a_random}</p>
            )}
          </div>

          {/* NKS */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="nks">NKS</Label>
            <Input
              id="nks"
              name="nks"
              value={nks}
              onChange={(e) => setNks(e.target.value)}
            />
            {errors.nks && (
              <p className="text-red-500 text-sm">{errors.nks}</p>
            )}
          </div>

          {/* Longitude */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="long">Longitude</Label>
            <Input
              id="long"
              name="long"
              value={longVal}
              onChange={(e) => setLongVal(e.target.value)}
            />
            {errors.long && (
              <p className="text-red-500 text-sm">{errors.long}</p>
            )}
          </div>

          {/* Latitude */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="lat">Latitude</Label>
            <Input
              id="lat"
              name="lat"
              value={latVal}
              onChange={(e) => setLatVal(e.target.value)}
            />
            {errors.lat && (
              <p className="text-red-500 text-sm">{errors.lat}</p>
            )}
          </div>

          {/* Subround */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="subround">Subround</Label>
            <Input
              id="subround"
              name="subround"
              value={subround}
              onChange={(e) => setSubround(e.target.value)}
            />
            {errors.subround && (
              <p className="text-red-500 text-sm">{errors.subround}</p>
            )}
          </div>

          {/* PCL ID
          <div className="flex flex-col space-y-2">
            <Label htmlFor="pcl_id">PCL ID</Label>
            <Input
              id="pcl_id"
              name="pcl_id"
              type="number"
              value={pclId ?? ""}
              onChange={(e) => setPclId(e.target.value ? Number(e.target.value) : undefined)}
            />
            {errors.pcl_id && (
              <p className="text-red-500 text-sm">{errors.pcl_id}</p>
            )}
          </div> */}

          {/* Tim ID
          <div className="flex flex-col space-y-2">
            <Label htmlFor="tim_id">Tim ID</Label>
            <Input
              id="tim_id"
              name="tim_id"
              type="number"
              value={timId ?? ""}
              onChange={(e) => setTimId(e.target.value ? Number(e.target.value) : undefined)}
            />
            {errors.tim_id && (
              <p className="text-red-500 text-sm">{errors.tim_id}</p>
            )}
          </div> */}

          {/* Tombol Aksi */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" disabled={processing}>
              {processing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Perbarui"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
