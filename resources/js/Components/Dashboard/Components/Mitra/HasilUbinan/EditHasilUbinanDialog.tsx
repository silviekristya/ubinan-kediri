// resources/js/Components/Dashboard/Components/Mitra/HasilUbinan/EditHasilUbinanDialog.tsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/Components/ui/dialog';
import { Button } from '@/Components/ui/button';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Textarea } from '@/Components/ui/textarea';
import { Checkbox } from '@/Components/ui/checkbox';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/Components/ui/select';

interface EditProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    id: number;
    tanggal_pencacahan: string;
    berat_hasil_ubinan?: number;
    jumlah_rumpun?: number;
    luas_lahan?: number;
    cara_penanaman?: string;
    jenis_pupuk?: string;
    penanganan_hama?: string;
    fenomena_id?: number;
    status: 'Selesai' | 'Gagal';
  }) => void;
  hasil: {
    id: number;
    tanggal_pencacahan: string;
    berat_hasil_ubinan?: number;
    jumlah_rumpun?: number;
    luas_lahan?: number;
    cara_penanaman?: string;
    jenis_pupuk?: string;
    penanganan_hama?: string;
    fenomena_id?: number;
    status: 'Selesai' | 'Gagal';
  };
  fenomenas: { id: number; nama: string }[];
}

export function EditHasilUbinanDialog({
  isOpen,
  onClose,
  onSave,
  hasil,
  fenomenas,
}: EditProps) {
  const [tanggal, setTanggal] = useState<string>('');
  const [berat, setBerat] = useState<string>('');
  const [rumpun, setRumpun] = useState<string>('');
  const [luas, setLuas] = useState<string>('');
  const [cara, setCara] = useState<string>('');
  const [pupuk, setPupuk] = useState<string>('');
  const [hama, setHama] = useState<string>('');
  const [status, setStatus] = useState<'Selesai' | 'Gagal'>('Selesai');
  const [fenomenaId, setFenomenaId] = useState<number | undefined>(undefined);

  // populate form when dialog opens
  useEffect(() => {
    if (isOpen) {
      setTanggal(hasil.tanggal_pencacahan);
      setBerat(hasil.berat_hasil_ubinan?.toString() || '');
      setRumpun(hasil.jumlah_rumpun?.toString() || '');
      setLuas(hasil.luas_lahan?.toString() || '');
      setCara(hasil.cara_penanaman || '');
      setPupuk(hasil.jenis_pupuk || '');
      setHama(hasil.penanganan_hama || '');
      setFenomenaId(hasil.fenomena_id ?? undefined);
      setStatus(hasil.status);
    }
  }, [isOpen, hasil]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: hasil.id,
      tanggal_pencacahan: tanggal,
      berat_hasil_ubinan: berat ? parseFloat(berat) : undefined,
      jumlah_rumpun: rumpun ? parseInt(rumpun, 10) : undefined,
      luas_lahan: luas ? parseFloat(luas) : undefined,
      cara_penanaman: cara || undefined,
      jenis_pupuk: pupuk || undefined,
      penanganan_hama: hama || undefined,
      fenomena_id: fenomenaId,
      status,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Hasil Ubinan</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tanggal">Tanggal Pencacahan</Label>
              <Input
                id="tanggal"
                type="date"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={status}
                onValueChange={(v) => setStatus(v as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Selesai">Selesai</SelectItem>
                  <SelectItem value="Gagal">Gagal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="berat">Berat Hasil Ubinan (kg)</Label>
              <Input
                id="berat"
                type="number"
                step="0.01"
                value={berat}
                onChange={(e) => setBerat(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="rumpun">Jumlah Rumpun</Label>
              <Input
                id="rumpun"
                type="number"
                value={rumpun}
                onChange={(e) => setRumpun(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="luas">Luas Lahan (ha)</Label>
              <Input
                id="luas"
                type="number"
                step="0.01"
                value={luas}
                onChange={(e) => setLuas(e.target.value)}
              />
            </div>
            <div className="space-y-2">
            <Label htmlFor="cara">Cara Penanaman</Label>
            <Input
              id="cara"
              value={cara}
              onChange={(e) => setCara(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pupuk">Jenis Pupuk</Label>
            <Input
              id="pupuk"
              value={pupuk}
              onChange={(e) => setPupuk(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hama">Penanganan Hama</Label>
            <Textarea
              id="hama"
              rows={3}
              value={hama}
              onChange={(e) => setHama(e.target.value)}
            />
          </div>

          <div>
              <Label htmlFor="fenomena">Fenomena</Label>
              <Select
                value={fenomenaId?.toString() || ''}
                onValueChange={(v) =>
                  setFenomenaId(v ? parseInt(v, 10) : undefined)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih fenomena" />
                </SelectTrigger>
                <SelectContent>
                  {fenomenas.map((f) => (
                    <SelectItem key={f.id} value={f.id.toString()}>
                      {f.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
           
          </div>

          <DialogFooter>
            <Button type="submit">Perbarui</Button>
            <Button variant="outline" onClick={onClose} type="button">
              Batal
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
