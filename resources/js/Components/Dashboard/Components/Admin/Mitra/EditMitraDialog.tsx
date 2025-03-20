import { useState, useEffect, FormEventHandler } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { usePage, useForm } from '@inertiajs/react';
import { Loader2 } from "lucide-react";
import { Mitra, WithCsrf, PageProps } from '@/types';
import { Checkbox } from "@/Components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Badge } from '@/Components/ui/badge';

interface MitraFormData extends Mitra, WithCsrf {}

interface EditMitraDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: MitraFormData) => Promise<void>;
  data: Mitra;
}

export const EditMitraDialog = ({ isOpen, onClose, onSave, data }: EditMitraDialogProps) => {
  const { csrf_token } = usePage<PageProps>().props;

  const [nama, setNama] = useState(data.nama);
  const [noTelepon, setNoTelepon] = useState(data.no_telepon);
  const [alamat, setAlamat] = useState(data.alamat || "");


  const { processing, errors } = useForm<MitraFormData>({
    ...data,
    _token: csrf_token,
  });

  useEffect(() => {
    if (isOpen) {
        setNama(data.nama);
        setNoTelepon(data.no_telepon);
        setAlamat(data.alamat || "");
    }
  }, [isOpen, data]);

  const handleSubmit: FormEventHandler = async (e) => {
    e.preventDefault();
    try {
      await onSave({
        id: data.id,
        user_id: data.user_id,
        nama,
        no_telepon: noTelepon,
        alamat,
        _token: csrf_token,
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
          <DialogTitle>Edit Mitra</DialogTitle>
          <DialogDescription>Edit data mitra</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input type="hidden" name="_token" value={csrf_token} />

          {/* Nama */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="nama">Nama</Label>
            <Input
              id="nama"
              name="nama"
              placeholder="Masukkan nama"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
            />
            {errors.nama && <p className="text-red-500 text-sm">{errors.nama}</p>}
          </div>

          {/* No Telepon */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="noTelepon">No Telepon</Label>
            <Input
              id="noTelepon"
              name="noTelepon"
              placeholder="Masukkan No Telepon"
              value={noTelepon}
              onChange={(e) => setNoTelepon(e.target.value)}
            />
            {errors.no_telepon && <p className="text-red-500 text-sm">{errors.no_telepon}</p>}
          </div>

          {/* Alamat */}
            <div className="flex flex-col space-y-2">
                <Label htmlFor="alamat">Alamat</Label>
                <Input
                id="alamat"
                name="alamat"
                placeholder="Masukkan Alamat"
                value={alamat}
                onChange={(e) => setAlamat(e.target.value)}
                />
                {errors.alamat && <p className="text-red-500 text-sm">{errors.alamat}</p>}
            </div>


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
