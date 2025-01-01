import { useState, useEffect, FormEventHandler } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { usePage, useForm } from '@inertiajs/react';
import { Loader2 } from "lucide-react";
import { Pegawai, WithCsrf, PageProps } from '@/types';
import { rolePegawai } from "@/Components/Dashboard/Components/Admin/Pegawai/DataTableFilterPegawai";
import { Checkbox } from "@/Components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Badge } from '@/Components/ui/badge';

interface PegawaiFormData extends Pegawai, WithCsrf {}

interface EditPegawaiDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: PegawaiFormData) => Promise<void>;
  data: Pegawai;
}

export const EditPegawaiDialog = ({ isOpen, onClose, onSave, data }: EditPegawaiDialogProps) => {
  const { csrf_token } = usePage<PageProps>().props;

  const [nama, setNama] = useState(data.nama);
  const [noTelepon, setNoTelepon] = useState(data.no_telepon || "");
  const [role, setRole] = useState<'ADMIN' | 'PEGAWAI'>(data.role);
  const [isPml, setIsPml] = useState(data.is_pml);


  const { processing, errors } = useForm<PegawaiFormData>({
    ...data,
    _token: csrf_token,
  });

  useEffect(() => {
    if (isOpen) {
        setNama(data.nama);
        setNoTelepon(data.no_telepon || "");
        setRole(data.role);
        setIsPml(data.is_pml);
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
        role,
        is_pml: isPml,
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
          <DialogTitle>Edit Pegawai</DialogTitle>
          <DialogDescription>Edit data pegawai</DialogDescription>
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

          {/* Role */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
            value={role}
            onValueChange={(value) => setRole(value as 'ADMIN' | 'PEGAWAI')}
            >
            <SelectTrigger className="w-full">
                <SelectValue>
                {rolePegawai.find((r) => r.value === role)?.label || "Pilih Role"}
                </SelectValue>
            </SelectTrigger>
            <SelectContent>
                {rolePegawai.map((roleItem) => (
                <SelectItem key={roleItem.value} value={roleItem.value}>
                    <Badge className={`text-xs ${roleItem.color}`}>{roleItem.label}</Badge>
                </SelectItem>
                ))}
            </SelectContent>
            </Select>
            {errors.role && (
                <p className="text-red-500 text-sm">
                    {errors.role[0] || "Role harus valid. Pilih antara ADMIN atau PEGAWAI."}
                </p>
            )}
          </div>

          {/* PML */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isPml"
              checked={Boolean(isPml)}
              onCheckedChange={(checked) => setIsPml(!!checked)}
              className='data-[state=checked]:bg-blue-bps-dark'
            />
            <Label htmlFor="isPml">PML</Label>
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
