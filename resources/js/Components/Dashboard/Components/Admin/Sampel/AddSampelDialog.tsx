import { useState, FormEventHandler } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { usePage, useForm } from '@inertiajs/react';
import { Loader2 } from "lucide-react";
import { Sampel, WithCsrf, PageProps } from '@/types';

/** Definisikan union type untuk enum. */
type JenisSampel = "Utama" | "Cadangan";
type JenisTanaman = "Padi" | "Palawija";

interface SampelFormData extends WithCsrf {
  jenis_sampel: JenisSampel;
  jenis_tanaman: JenisTanaman;
  frame_ksa?: string;
  prov: string;
  kab: string;
  kec: string;
  nama_prov: string;
  nama_kab: string;
  nama_kec: string;
  nama_lok: string;
  segmen_id?: string;
  subsegmen: string;
  strata: string;
  bulan_listing: string;
  tahun_listing: string;
  fase_tanam?: string;
  rilis?: string;
  a_random?: string;
  nks: string;
  long: string;
  lat: string;
  subround: string;
  pcl_id?: number;
  tim_id?: number;
}

interface AddSampelDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: SampelFormData) => Promise<void>;
}

export const AddSampelDialog = ({ isOpen, onClose, onSave }: AddSampelDialogProps) => {
  const { csrf_token } = usePage<PageProps>().props;

  // State untuk tiap kolom
  const [jenisSampel, setJenisSampel] = useState<JenisSampel | "">("");
  const [jenisTanaman, setJenisTanaman] = useState<JenisTanaman | "">("");
  const [frameKsa, setFrameKsa] = useState("");
  const [prov, setProv] = useState("");
  const [kab, setKab] = useState("");
  const [kec, setKec] = useState("");
  const [namaProv, setNamaProv] = useState("");
  const [namaKab, setNamaKab] = useState("");
  const [namaKec, setNamaKec] = useState("");
  const [namaLok, setNamaLok] = useState("");
  const [segmenId, setSegmenId] = useState("");
  const [subsegmen, setSubsegmen] = useState("");
  const [strata, setStrata] = useState("");
  const [bulanListing, setBulanListing] = useState("");
  const [tahunListing, setTahunListing] = useState("");
  const [faseTanam, setFaseTanam] = useState("");
  // State tetap Date atau Date | null
  const [rilis, setRilis] = useState("");  
  const [aRandom, setARandom] = useState("");
  const [nks, setNks] = useState("");
  const [longVal, setLongVal] = useState("");
  const [latVal, setLatVal] = useState("");
  const [subround, setSubround] = useState("");
  const [pclId, setPclId] = useState<number | undefined>(undefined);
  const [timId, setTimId] = useState<number | undefined>(undefined);

  // Gunakan useForm untuk menangani error dan processing
  const { processing, errors } = useForm<SampelFormData>({
    jenis_sampel: "Utama", //set default value = Utama
    jenis_tanaman: "Padi", // set default value = Padi
    frame_ksa: "",
    prov: "",
    kab: "",
    kec: "",
    nama_prov: "",
    nama_kab: "",
    nama_kec: "",
    nama_lok: "",
    segmen_id: "",
    subsegmen: "",
    strata: "",
    bulan_listing: "",
    tahun_listing: "",
    fase_tanam: "",
    rilis: "",
    a_random: "",
    nks: "",
    long: "",
    lat: "",
    subround: "",
    _token: csrf_token
    // pcl_id, tim_id akan diisi manual jika diperlukan
  });

  const handleSubmit: FormEventHandler = async (e) => {
    e.preventDefault();
    if (jenisSampel === "") {
        alert("Pilih jenis sampel");
        return;
      }
      if (jenisTanaman === "") {
        alert("Pilih jenis tanaman");
        return;
      }
    try {
      await onSave({
        jenis_sampel: jenisSampel,
        jenis_tanaman: jenisTanaman,
        frame_ksa: frameKsa || undefined,
        prov,
        kab,
        kec,
        nama_prov: namaProv,
        nama_kab: namaKab,
        nama_kec: namaKec,
        nama_lok: namaLok,
        segmen_id: segmenId || undefined,
        subsegmen,
        strata,
        bulan_listing: bulanListing,
        tahun_listing: tahunListing,
        fase_tanam: faseTanam || undefined,
        rilis: rilis || undefined,
        a_random: aRandom || undefined,
        nks,
        long: longVal,
        lat: latVal,
        subround,
        pcl_id: pclId,
        tim_id: timId,
        _token: csrf_token
      });

      // Reset field setelah submit
      setJenisSampel("Utama");
      setJenisTanaman("Padi");
      setFrameKsa("");
      setProv("");
      setKab("");
      setKec("");
      setNamaProv("");
      setNamaKab("");
      setNamaKec("");
      setNamaLok("");
      setSegmenId("");
      setSubsegmen("");
      setStrata("");
      setBulanListing("");
      setTahunListing("");
      setFaseTanam("");
      setRilis("");
      setARandom("");
      setNks("");
      setLongVal("");
      setLatVal("");
      setSubround("");
      setPclId(undefined);
      setTimId(undefined);

      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tambah Sampel Baru</DialogTitle>
          <DialogDescription>Masukkan data sampel baru</DialogDescription>
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
              onChange={(e) => setJenisSampel(e.target.value as JenisSampel | "")}
            >
              <option value="">Pilih Jenis Sampel</option>
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
              onChange={(e) => setJenisTanaman(e.target.value as JenisTanaman | "")}
            >
              <option value="">Pilih Jenis Tanaman</option>
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
              placeholder="Jika ada"
              value={frameKsa}
              onChange={(e) => setFrameKsa(e.target.value)}
            />
            {errors.frame_ksa && (
              <p className="text-red-500 text-sm">{errors.frame_ksa}</p>
            )}
          </div>

          {/* Prov */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="prov">Provinsi (kode)</Label>
            <Input
              id="prov"
              name="prov"
              placeholder="Misal: 35"
              value={prov}
              onChange={(e) => setProv(e.target.value)}
            />
            {errors.prov && (
              <p className="text-red-500 text-sm">{errors.prov}</p>
            )}
          </div>

          {/* Kab */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="kab">Kabupaten (kode)</Label>
            <Input
              id="kab"
              name="kab"
              placeholder="Misal: 06"
              value={kab}
              onChange={(e) => setKab(e.target.value)}
            />
            {errors.kab && (
              <p className="text-red-500 text-sm">{errors.kab}</p>
            )}
          </div>

          {/* Kec */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="kec">Kecamatan (kode)</Label>
            <Input
              id="kec"
              name="kec"
              placeholder="Misal: 010"
              value={kec}
              onChange={(e) => setKec(e.target.value)}
            />
            {errors.kec && (
              <p className="text-red-500 text-sm">{errors.kec}</p>
            )}
          </div>

          {/* Nama Prov */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="nama_prov">Nama Provinsi</Label>
            <Input
              id="nama_prov"
              name="nama_prov"
              placeholder="Jawa Timur"
              value={namaProv}
              onChange={(e) => setNamaProv(e.target.value)}
            />
            {errors.nama_prov && (
              <p className="text-red-500 text-sm">{errors.nama_prov}</p>
            )}
          </div>

          {/* Nama Kab */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="nama_kab">Nama Kabupaten</Label>
            <Input
              id="nama_kab"
              name="nama_kab"
              placeholder="Kediri"
              value={namaKab}
              onChange={(e) => setNamaKab(e.target.value)}
            />
            {errors.nama_kab && (
              <p className="text-red-500 text-sm">{errors.nama_kab}</p>
            )}
          </div>

          {/* Nama Kec */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="nama_kec">Nama Kecamatan</Label>
            <Input
              id="nama_kec"
              name="nama_kec"
              placeholder="Mojo"
              value={namaKec}
              onChange={(e) => setNamaKec(e.target.value)}
            />
            {errors.nama_kec && (
              <p className="text-red-500 text-sm">{errors.nama_kec}</p>
            )}
          </div>

          {/* Nama Lok */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="nama_lok">Nama Lokasi</Label>
            <Input
              id="nama_lok"
              name="nama_lok"
              placeholder="Nama lokasi ubinan"
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
              placeholder="Kode segmen"
              value={segmenId}
              onChange={(e) => setSegmenId(e.target.value)}
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
              placeholder="Kode subsegmen"
              value={subsegmen}
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
              placeholder="Kode strata"
              value={strata}
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
              placeholder="Misal: 09"
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
              placeholder="Misal: 2025"
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
              placeholder="Misal: vegetatif"
              value={faseTanam}
              onChange={(e) => setFaseTanam(e.target.value)}
            />
            {errors.fase_tanam && (
              <p className="text-red-500 text-sm">{errors.fase_tanam}</p>
            )}
          </div>

          {/* Rilis */}
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
              placeholder="..."
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
              placeholder="Misal: 123456789"
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
              placeholder="Misal: 112.34567"
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
              placeholder="Misal: -7.78901"
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
              placeholder="Misal: 01"
              value={subround}
              onChange={(e) => setSubround(e.target.value)}
            />
            {errors.subround && (
              <p className="text-red-500 text-sm">{errors.subround}</p>
            )}
          </div>

          {/* PCL ID */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="pcl_id">PCL ID</Label>
            <Input
              id="pcl_id"
              name="pcl_id"
              type="number"
              placeholder="ID mitra (jika ada)"
              value={pclId ?? ""}
              onChange={(e) => setPclId(e.target.value ? Number(e.target.value) : undefined)}
            />
            {errors.pcl_id && (
              <p className="text-red-500 text-sm">{errors.pcl_id}</p>
            )}
          </div>

          {/* Tim ID */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="tim_id">Tim ID</Label>
            <Input
              id="tim_id"
              name="tim_id"
              type="number"
              placeholder="ID tim (jika ada)"
              value={timId ?? ""}
              onChange={(e) => setTimId(e.target.value ? Number(e.target.value) : undefined)}
            />
            {errors.tim_id && (
              <p className="text-red-500 text-sm">{errors.tim_id}</p>
            )}
          </div>

          {/* Tombol Aksi */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" disabled={processing}>
              {processing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Simpan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
