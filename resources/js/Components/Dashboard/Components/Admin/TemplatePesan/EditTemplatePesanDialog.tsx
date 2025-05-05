import { useState, useEffect, FormEventHandler } from 'react';
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

interface EditTemplatePesanDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: number, formData: TemplatePesanFormData) => Promise<void>;
  template: {
    id: number;
    nama_template: string;
    text: string;
  };
}

export const EditTemplatePesanDialog = ({
  isOpen,
  onClose,
  onUpdate,
  template,
}: EditTemplatePesanDialogProps) => {
  const { csrf_token } = usePage<PageProps>().props;

  // local state for form fields
  const [nama, setNama] = useState("");
  const [isi, setIsi]   = useState("");

  // Inertia form for processing & errors
  const form = useForm<TemplatePesanFormData>({
    nama: "",
    isi: "",
    _token: csrf_token,
  });

  // When dialog opens or template changes, initialize form
  useEffect(() => {
    if (isOpen && template) {
      setNama(template.nama_template);
      setIsi(template.text);
  
      form.setData('nama', template.nama_template);
      form.setData('isi',  template.text);
      form.setData('_token', csrf_token);
  
      form.clearErrors();
    }
  }, [isOpen, template]);
  

  const handleSubmit: FormEventHandler = async (e) => {
    e.preventDefault();
    form.clearErrors();
    try {
      await onUpdate(template.id, {
        nama,
        isi,
        _token: csrf_token,
      });
      onClose();
    } catch (err: any) {
      if (err.response?.status === 422) {
        form.setError(err.response.data.errors);
      } else {
        console.error(err);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Template Pesan</DialogTitle>
          <DialogDescription>
            Ubah nama dan isi template. Placeholder seperti <code>{"{{nama}}"}</code> dan <code>{"{{role}}"}</code> dapat digunakan.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
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
            {form.errors.nama && <p className="text-red-500 text-sm">{form.errors.nama}</p>}
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
            {form.errors.isi && <p className="text-red-500 text-sm">{form.errors.isi}</p>}
          </div>

          {/* Aksi */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" disabled={form.processing}>
              {form.processing
                ? <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                : "Perbarui"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
