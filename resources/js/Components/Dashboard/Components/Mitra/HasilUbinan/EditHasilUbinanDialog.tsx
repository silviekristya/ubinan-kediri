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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/Components/ui/select';

export interface EditHasilUbinanDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    id: number;
    pengecekan_id: number;
    tanggal_pencacahan: string;
    status: 'Selesai' | 'Gagal';
    berat_hasil_ubinan?: number;
    jumlah_rumpun?: number;
    luas_lahan?: number;
    cara_penanaman?: string;
    jenis_pupuk?: string;
    penanganan_hama?: string;
    fenomena_id?: number;
  }) => Promise<void> | void;
  hasil: {
    id: number;
    pengecekan_id: number;
    tanggal_pencacahan: string;
    status: 'Selesai' | 'Gagal';
    berat_hasil_ubinan?: number;
    jumlah_rumpun?: number;
    luas_lahan?: number;
    cara_penanaman?: string;
    jenis_pupuk?: string;
    penanganan_hama?: string;
    fenomena_id?: number;
  };
  fenomenas: { id: number; nama: string }[];
}

export function EditHasilUbinanDialog({
  isOpen,
  onClose,
  onSave,
  hasil,
  fenomenas,
}: EditHasilUbinanDialogProps) {
  // State untuk setiap field
  const [tanggal, setTanggal] = useState<string>('');
  const [status, setStatus] = useState<'Selesai' | 'Gagal'>('Selesai');
  const [berat, setBerat] = useState<string>('');
  const [rumpun, setRumpun] = useState<string>('');
  const [luas, setLuas] = useState<string>('');
  const [cara, setCara] = useState<string>('');
  const [pupuk, setPupuk] = useState<string>('');
  const [hama, setHama] = useState<string>('');
  const [fenomenaId, setFenomenaId] = useState<number | undefined>(undefined);

  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [saving, setSaving] = useState<boolean>(false);

  // Isi ulang form saat dibuka
  useEffect(() => {
    if (!isOpen) return;
    setTanggal(hasil.tanggal_pencacahan);
    setStatus(hasil.status);
    setBerat(hasil.berat_hasil_ubinan?.toString() ?? '');
    setRumpun(hasil.jumlah_rumpun?.toString() ?? '');
    setLuas(hasil.luas_lahan?.toString() ?? '');
    setCara(hasil.cara_penanaman ?? '');
    setPupuk(hasil.jenis_pupuk ?? '');
    setHama(hasil.penanganan_hama ?? '');
    setFenomenaId(hasil.fenomena_id);
    setErrors({});
    setSaving(false);
  }, [isOpen, hasil]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});

    try {
      await onSave({
        id: hasil.id,
        pengecekan_id: hasil.pengecekan_id,
        tanggal_pencacahan: tanggal,
        status,
        berat_hasil_ubinan: berat ? parseFloat(berat) : undefined,
        jumlah_rumpun: rumpun ? parseInt(rumpun, 10) : undefined,
        luas_lahan: luas ? parseFloat(luas) : undefined,
        cara_penanaman: cara || undefined,
        jenis_pupuk: pupuk || undefined,
        penanganan_hama: hama || undefined,
        fenomena_id: fenomenaId,
      });
      onClose();
    } catch (err: any) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Hasil Ubinan</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tanggal Pencacahan */}
          <div>
            <Label htmlFor="tanggal">Tanggal Pencacahan</Label>
            <Input
              id="tanggal"
              type="date"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              required
            />
            {errors.tanggal_pencacahan && (
              <p className="text-red-600 text-sm">
                {errors.tanggal_pencacahan[0]}
              </p>
            )}
          </div>

          {/* Status */}
          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as any)}>
              <SelectTrigger aria-label="Pilih status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Selesai">Selesai</SelectItem>
                <SelectItem value="Gagal">Gagal</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-red-600 text-sm">{errors.status[0]}</p>
            )}
          </div>

          {/* Berat Hasil Ubinan */}
          <div>
            <Label htmlFor="berat">Berat Hasil Ubinan (kg)</Label>
            <Input
              id="berat"
              type="number"
              step="0.01"
              value={berat}
              onChange={(e) => setBerat(e.target.value)}
            />
            {errors.berat_hasil_ubinan && (
              <p className="text-red-600 text-sm">
                {errors.berat_hasil_ubinan[0]}
              </p>
            )}
          </div>

          {/* Jumlah Rumpun */}
          <div>
            <Label htmlFor="rumpun">Jumlah Rumpun</Label>
            <Input
              id="rumpun"
              type="number"
              value={rumpun}
              onChange={(e) => setRumpun(e.target.value)}
            />
            {errors.jumlah_rumpun && (
              <p className="text-red-600 text-sm">
                {errors.jumlah_rumpun[0]}
              </p>
            )}
          </div>

          {/* Luas Lahan */}
          <div>
            <Label htmlFor="luas">Luas Lahan (ha)</Label>
            <Input
              id="luas"
              type="number"
              step="0.01"
              value={luas}
              onChange={(e) => setLuas(e.target.value)}
            />
            {errors.luas_lahan && (
              <p className="text-red-600 text-sm">{errors.luas_lahan[0]}</p>
            )}
          </div>

          {/* Cara Penanaman */}
          <div>
            <Label htmlFor="cara">Cara Penanaman</Label>
            <Input
              id="cara"
              value={cara}
              onChange={(e) => setCara(e.target.value)}
            />
            {errors.cara_penanaman && (
              <p className="text-red-600 text-sm">
                {errors.cara_penanaman[0]}
              </p>
            )}
          </div>

          {/* Jenis Pupuk */}
          <div>
            <Label htmlFor="pupuk">Jenis Pupuk</Label>
            <Input
              id="pupuk"
              value={pupuk}
              onChange={(e) => setPupuk(e.target.value)}
            />
            {errors.jenis_pupuk && (
              <p className="text-red-600 text-sm">
                {errors.jenis_pupuk[0]}
              </p>
            )}
          </div>

          {/* Penanganan Hama */}
          <div>
            <Label htmlFor="hama">Penanganan Hama</Label>
            <Textarea
              id="hama"
              rows={2}
              value={hama}
              onChange={(e) => setHama(e.target.value)}
            />
            {errors.penanganan_hama && (
              <p className="text-red-600 text-sm">
                {errors.penanganan_hama[0]}
              </p>
            )}
          </div>

          {/* Fenomena */}
          <div>
            <Label htmlFor="fenomena">Fenomena</Label>
            <Select
              value={fenomenaId !== undefined ? String(fenomenaId) : undefined}
              onValueChange={(v) =>
                setFenomenaId(v ? parseInt(v, 10) : undefined)
              }
            >
              <SelectTrigger aria-label="Pilih fenomena">
                <SelectValue placeholder="— Pilih Fenomena —" />
              </SelectTrigger>
              <SelectContent>
                {fenomenas.map((f) => (
                  <SelectItem key={f.id} value={f.id.toString()}>
                    {f.nama}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.fenomena_id && (
              <p className="text-red-600 text-sm">
                {errors.fenomena_id[0]}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button type="submit" disabled={saving}>
              {saving ? 'Menyimpan…' : 'Perbarui'}
            </Button>
            <Button variant="outline" onClick={onClose} type="button">
              Batal
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
