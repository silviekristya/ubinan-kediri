import { useState, FormEventHandler } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Label } from "@/Components/ui/label";
import { usePage, useForm } from '@inertiajs/react';
import { Popover, PopoverContent, PopoverTrigger } from "@/Components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/Components/ui/command";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { PageProps, Sampel } from '@/types';

interface AddPengecekanDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: {
    id_sampel: string;
    tanggal_pengecekan: string;
    nama_responden: string;
    alamat_responden: string;
    no_telepon_responden: string;
    tanggal_panen: string;
    keterangan?: string;
    _token: string;
  }) => Promise<void>;
  samples: Sampel[];
}

export const AddPengecekanDialog = ({ isOpen, onClose, onSave, samples }: AddPengecekanDialogProps) => {
  const { csrf_token } = usePage<PageProps>().props;

  const [selectedSampleId, setSelectedSampleId] = useState("");
  const [openPopover, setOpenPopover] = useState(false);
  const [tanggal, setTanggal] = useState("");
  const [namaRes, setNamaRes] = useState("");
  const [alamatRes, setAlamatRes] = useState("");
  const [telpRes, setTelpRes] = useState("");
  const [tanggalPanen, setTanggalPanen] = useState("");
  const [keterangan, setKeterangan] = useState("");

  const { processing, errors } = useForm({
    id_sampel: "",
    tanggal_pengecekan: "",
    nama_responden: "",
    alamat_responden: "",
    no_telepon_responden: "",
    tanggal_panen: "",
    keterangan: "",
    _token: csrf_token,
  });

  const handleSubmit: FormEventHandler = async (e) => {
    e.preventDefault();

    await onSave({
      id_sampel: selectedSampleId,
      tanggal_pengecekan: tanggal,
      nama_responden: namaRes,
      alamat_responden: alamatRes,
      no_telepon_responden: telpRes,
      tanggal_panen: tanggalPanen,
      keterangan: keterangan,
      _token: csrf_token,
    });

    setSelectedSampleId("");
    setTanggal("");
    setNamaRes("");
    setAlamatRes("");
    setTelpRes("");
    setTanggalPanen("");
    setKeterangan("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Pengecekan Sampel</DialogTitle>
          <DialogDescription>Isi detail pengecekan untuk sampel yang dipilih</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input type="hidden" name="_token" value={csrf_token} />

          <div className="flex flex-col space-y-2">
            <Label htmlFor="sample">Pilih Sampel</Label>
            <Popover open={openPopover} onOpenChange={setOpenPopover}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openPopover}
                  className="w-full justify-between"
                >
                  {samples.find(s => String(s.id) === selectedSampleId)
                    ? `${samples.find(s => String(s.id) === selectedSampleId)!.jenis_sampel} — ${samples.find(s => String(s.id) === selectedSampleId)!.jenis_tanaman}`
                    : "Pilih sampel..."}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Cari sampel..." />
                  <CommandList>
                    <CommandEmpty>Tidak ada sampel ditemukan.</CommandEmpty>
                    <CommandGroup>
                      {samples.map(s => (
                        <CommandItem
                          key={s.id}
                          value={String(s.id)}
                          onSelect={(value) => {
                            setSelectedSampleId(value);
                            setOpenPopover(false);
                          }}
                        >
                          <span className="flex flex-col">
                            <span className="font-medium">{s.jenis_sampel}</span>
                            <span className="text-sm opacity-70">{s.jenis_tanaman}</span>
                          </span>
                          <Check
                            className={`ml-auto ${selectedSampleId === String(s.id) ? 'opacity-100' : 'opacity-0'}`}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {errors.id_sampel && <p className="text-red-500 text-sm">{errors.id_sampel}</p>}
          </div>

          <div className="flex flex-col space-y-2">
            <Label htmlFor="tanggal">Tanggal Pengecekan</Label>
            <Input
              id="tanggal"
              type="date"
              value={tanggal}
              onChange={e => setTanggal(e.target.value)}
            />
            {errors.tanggal_pengecekan && <p className="text-red-500 text-sm">{errors.tanggal_pengecekan}</p>}
          </div>

          <div className="flex flex-col space-y-2">
            <Label htmlFor="namaResponden">Nama Responden</Label>
            <Input
              id="namaResponden"
              placeholder="Nama responden"
              value={namaRes}
              onChange={e => setNamaRes(e.target.value)}
            />
            {errors.nama_responden && <p className="text-red-500 text-sm">{errors.nama_responden}</p>}
          </div>

          <div className="flex flex-col space-y-2">
            <Label htmlFor="alamatResponden">Alamat Responden</Label>
            <Input
              id="alamatResponden"
              placeholder="Alamat lengkap"
              value={alamatRes}
              onChange={e => setAlamatRes(e.target.value)}
            />
            {errors.alamat_responden && <p className="text-red-500 text-sm">{errors.alamat_responden}</p>}
          </div>

          <div className="flex flex-col space-y-2">
            <Label htmlFor="telpResponden">No. Telepon Responden</Label>
            <Input
              id="telpResponden"
              placeholder="08xx..."
              value={telpRes}
              onChange={e => setTelpRes(e.target.value)}
            />
            {errors.no_telepon_responden && <p className="text-red-500 text-sm">{errors.no_telepon_responden}</p>}
          </div>

          <div className="flex flex-col space-y-2">
            <Label htmlFor="tanggalPanen">Tanggal Panen</Label>
            <Input
              id="tanggalPanen"
              type="date"
              value={tanggalPanen}
              onChange={e => setTanggalPanen(e.target.value)}
            />
            {errors.tanggal_panen && <p className="text-red-500 text-sm">{errors.tanggal_panen}</p>}
          </div>

          <div className="flex flex-col space-y-2">
            <Label htmlFor="keterangan">Keterangan</Label>
            <Textarea
              id="keterangan"
              placeholder="Keterangan tambahan (opsional)"
              value={keterangan}
              onChange={e => setKeterangan(e.target.value)}
              rows={2}
            />
            {errors.keterangan && <p className="text-red-500 text-sm">{errors.keterangan}</p>}
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onClose}>Batal</Button>
            <Button type="submit" disabled={processing}>
              {processing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Simpan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
