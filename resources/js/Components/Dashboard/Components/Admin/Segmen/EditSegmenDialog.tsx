import { useState, useEffect, FormEventHandler } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { usePage, useForm } from '@inertiajs/react';
import { Loader2 } from "lucide-react";
import { Segmen, WithCsrf, PageProps } from '@/types';

interface SegmenFormData extends Segmen, WithCsrf {
}

interface EditSegmenDialogProps {
  isOpen: boolean;
  onClose: () => void;
  segmen: Segmen;
  onSave: (formData: Segmen & WithCsrf) => Promise<void>;
}

export const EditSegmenDialog = ({ isOpen, onClose, segmen, onSave }: EditSegmenDialogProps) => {
  const { csrf_token } = usePage<PageProps>().props;

  const [idSegmen, setIdSegmen] = useState(segmen.id_segmen);
  const [namaSegmen, setNamaSegmen] = useState(segmen.nama_segmen);

  const { processing, errors } = useForm<SegmenFormData>({
    ...segmen,
    _token: csrf_token,
  });

  useEffect(() => {
    if (isOpen) {
        setIdSegmen(segmen.id_segmen);
        setNamaSegmen(segmen.nama_segmen);
    }
  }, [isOpen, segmen]);

  const handleSubmit: FormEventHandler = async (e) => {
    e.preventDefault();

    try {
      await onSave({
        id_segmen: idSegmen,
        nama_segmen: namaSegmen,
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
          <DialogTitle>Edit Segmen</DialogTitle>
          <DialogDescription>Perbarui data segmen</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <Input type="hidden" name="_token" value={csrf_token} />

            {/* ID Segmen */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="idSegmen">ID Segmen</Label>
            <Input
              id="idSegmen"
              name="idSegmen"
              placeholder="ID Segmen"
              value={idSegmen}
              onChange={(e) => setIdSegmen(e.target.value)}
            />
            {errors.id_segmen && <p className="text-red-500 text-sm">{errors.id_segmen}</p>}
          </div>

            {/* Nama Segmen */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="namaSegmen">Nama Segmen</Label>
            <Input
              id="namaSegmen"
              name="namaSegmen"
              placeholder="Nama Segmen"
              value={namaSegmen}
              onChange={(e) => setNamaSegmen(e.target.value)}
            />
            {errors.nama_segmen && <p className="text-red-500 text-sm">{errors.nama_segmen}</p>}
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
