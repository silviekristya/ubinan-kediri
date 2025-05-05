import { useState, FormEventHandler } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Label } from "@/Components/ui/label";
import { usePage, useForm } from '@inertiajs/react';
import { Loader2 } from "lucide-react";
import { PageProps, WithCsrf } from '@/types';

interface TemplatePesanFormData extends WithCsrf {
  nama: string;
  isi: string;
}

interface AddTemplatePesanDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: TemplatePesanFormData) => Promise<void>;
}

export const AddTemplatePesanDialog = ({ isOpen, onClose, onSave }: AddTemplatePesanDialogProps) => {
  const { csrf_token } = usePage<PageProps>().props;

  const [nama, setNama] = useState("");
  const [isi, setIsi]   = useState("");

  const { processing, errors } = useForm<TemplatePesanFormData>({
    nama: "",
    isi: "",
    _token: csrf_token,
  });

  const handleSubmit: FormEventHandler = async (e) => {
    e.preventDefault();
    try {
      await onSave({
        nama,
        isi,
        _token: csrf_token,
      });
      // reset & close
      setNama("");
      setIsi("");
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Template Pesan</DialogTitle>
          <DialogDescription>
            Buat template baru dengan placeholder seperti <code>{"{{nama}}"}</code> atau <code>{"{{role}}"}</code>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          {/* CSRF token */}
          <input type="hidden" name="_token" value={csrf_token} />

          {/* Nama Template */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="nama">Nama Template</Label>
            <Input
              id="nama"
              name="nama"
              placeholder="Contoh: bulan-sampel"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
            />
            {errors.nama && <p className="text-red-500 text-sm">{errors.nama}</p>}
          </div>

          {/* Isi Template */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="isi">Isi Template</Label>
            <Textarea
              id="isi"
              name="isi"
              placeholder="Halo {{nama}}, Anda sebagai {{role}} ..."
              rows={6}
              value={isi}
              onChange={(e) => setIsi(e.target.value)}
            />
            {errors.isi && <p className="text-red-500 text-sm">{errors.isi}</p>}
          </div>

          {/* Aksi */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" disabled={processing}>
              {processing
                ? <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                : "Simpan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
