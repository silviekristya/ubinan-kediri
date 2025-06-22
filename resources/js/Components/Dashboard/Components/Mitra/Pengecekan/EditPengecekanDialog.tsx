import React, { useState, FormEvent } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import axios from "axios";

export interface EditPengecekanDialogProps {
  isOpen: boolean;
  onClose: () => void;
  data: { id: string; tanggal_panen: string };
  onSave: (updated: any) => void;
}

export const EditPengecekanDialog = ({ isOpen, onClose, data, onSave}: EditPengecekanDialogProps) => {
  const [tanggalPanen, setTanggalPanen] = useState(data.tanggal_panen || "");
  const [saving, setSaving] = useState(false);

  // H-3/H-1 check
  const today = dayjs().startOf("day");
  const tPanen = dayjs(data.tanggal_panen).startOf("day");
  const diff = tPanen.diff(today, "day");
  const canEdit = diff >= 1 && diff <= 3;


  const handleSubmit = (e: any) => {
    e.preventDefault();
    onSave({ ...data, tanggal_panen: tanggalPanen }); // Cuma callback!
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setSaving(true);
  //   try {
  //     const res = await axios.post('/dashboard/mitra/pengecekan/update/${data.id}', {
  //       tanggal_panen: tanggalPanen,
  //     });
  //     if (res.data.status === "success") {
  //       toast.success(res.data.message);
  //       onSave?.(res.data.pengecekan);
  //       onClose();
  //     } else {
  //       toast.error(res.data.message || "Gagal update.");
  //     }
  //   } catch (e: any) {
  //     if (e.response?.status === 403) {
  //       toast.error(e.response.data.message || "Tidak bisa update saat ini.");
  //     } else {
  //       toast.error("Gagal update.");
  //     }
  //   }
  //   setSaving(false);
  // };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Tanggal Panen</DialogTitle>
          <DialogDescription>
            Perbarui tanggal panen hanya pada H-3 hingga H-1 sebelum panen.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Tanggal Panen</Label>
            <Input
              type="date"
              value={tanggalPanen}
              onChange={e => setTanggalPanen(e.target.value)}
              required
              disabled={!canEdit}
            />
            {!canEdit && (
              <div className="text-xs text-red-500 mt-1">
                Edit hanya bisa dilakukan pada H-3 hingga H-1 sebelum tanggal panen.
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={onClose}>Batal</Button>
            <Button type="submit" disabled={!canEdit || saving}>
              Simpan
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
