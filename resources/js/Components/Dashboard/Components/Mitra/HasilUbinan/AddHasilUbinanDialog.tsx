// resources/js/Components/Dashboard/Components/Mitra/HasilUbinan/AddHasilUbinanDialog.tsx
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
import { Checkbox } from '@/Components/ui/checkbox';
import { toast } from 'react-toastify';

export interface AddHasilUbinanDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
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
  pengecekanId: number;
  fenomenas: { id: number; nama: string }[];
}

export function AddHasilUbinanDialog({
  isOpen,
  onClose,
  onSave,
  pengecekanId,
  fenomenas,
}: AddHasilUbinanDialogProps) {
  const [tanggal, setTanggal] = useState('');
  const [status, setStatus] = useState<'Selesai' | 'Gagal'>('Selesai');
  const [berat, setBerat] = useState('');
  const [rumpun, setRumpun] = useState('');
  const [luas, setLuas] = useState('');
  const [cara, setCara] = useState('');
  const [pupuk, setPupuk] = useState('');
  const [hama, setHama] = useState('');
  const [fenomenaId, setFenomenaId] = useState<number | ''>('');
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTanggal('');
      setStatus('Selesai');
      setBerat('');
      setRumpun('');
      setLuas('');
      setCara('');
      setPupuk('');
      setHama('');
      setFenomenaId('');
      setErrors({});
      setSaving(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    try {
      await onSave({
        pengecekan_id: pengecekanId,
        tanggal_pencacahan: tanggal,
        status,
        berat_hasil_ubinan: berat ? parseFloat(berat) : undefined,
        jumlah_rumpun: rumpun ? parseInt(rumpun, 10) : undefined,
        luas_lahan: luas ? parseFloat(luas) : undefined,
        cara_penanaman: cara || undefined,
        jenis_pupuk: pupuk || undefined,
        penanganan_hama: hama || undefined,
        fenomena_id: typeof fenomenaId === 'number' ? fenomenaId : undefined,
      });
      onClose();
    } catch (err: any) {
      // assume Inertia-style validation errors under err.response.data.errors
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        toast.error('Gagal menyimpan hasil ubinan.');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Hasil Ubinan</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col h-[80vh]">
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {/* Tanggal */}
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
                <Select
                  value={status}
                  onValueChange={(v) => setStatus(v as any)}
                >
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

              {/* Berat */}
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
                  <p className="text-red-600 text-sm">{errors.jenis_pupuk[0]}</p>
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
                  value={fenomenaId.toString()}
                  onValueChange={(v) =>
                    setFenomenaId(v ? parseInt(v, 10) : '')
                  }
                >
                  <SelectTrigger aria-label="Pilih fenomena">
                    <SelectValue placeholder="— Pilih fenomena —" />
                  </SelectTrigger>
                  <SelectContent>
                    {fenomenas.map((f)=>(
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
            </div>
          </div>

          <DialogFooter className="flex-shrink-0 border-t px-6 py-3 bg-white">
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Batal
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? 'Menyimpan…' : 'Simpan'}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
