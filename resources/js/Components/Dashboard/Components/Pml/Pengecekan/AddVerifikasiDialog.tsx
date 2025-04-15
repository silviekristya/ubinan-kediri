import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/Components/ui/select";

interface VerifyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    id: number;
    status_sampel: "Eligible" | "NonEligible" | "Belum";
    id_sampel_cadangan?: number;
  }) => void;
  pengecekanId: number;
  cadanganOptions: { id: number; label: string }[];
}

export function VerifyDialog({
  isOpen,
  onClose,
  onSave,
  pengecekanId,
  cadanganOptions,
}: VerifyDialogProps) {
  // default status = "Belum"
  const [status, setStatus] = useState<"Eligible" | "NonEligible" | "Belum">("Belum");
  const [cadangan, setCadangan] = useState<number | undefined>(undefined);

  // reset form setiap kali dialog dibuka
  useEffect(() => {
    setStatus("Belum");
    setCadangan(undefined);
  }, [isOpen]);

  const handleSubmit = () => {
    onSave({
      id: pengecekanId,
      status_sampel: status,
      id_sampel_cadangan: status === "NonEligible" ? cadangan : undefined,
    });
  };

  // disable simpan kalau NonEligible tapi belum pilih cadangan
  const isSaveDisabled = status === "NonEligible" && cadangan == null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Verifikasi Pengecekan</DialogTitle>
        </DialogHeader>

        {/* Status */}
        <div className="space-y-2">
          <label className="font-medium">Status Sampel</label>
          <Select value={status} onValueChange={v => setStatus(v as any)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Belum">Belum</SelectItem>
              <SelectItem value="Eligible">Eligible</SelectItem>
              <SelectItem value="NonEligible">Non‑eligible</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Dropdown Cadangan hanya saat Non‑eligible */}
        <div className="space-y-2 mt-4">
          <label className="font-medium">Sampel Cadangan</label>
          <Select
            value={cadangan != null ? String(cadangan) : undefined}
            onValueChange={v => setCadangan(Number(v))}
            disabled={status !== "NonEligible"}
          >
            <SelectTrigger>
              <SelectValue placeholder={
                status === "NonEligible"
                  ? "Pilih sampel cadangan"
                  : "Pilih status Non‑eligible dahulu"
              }/>
            </SelectTrigger>
            <SelectContent>
              {cadanganOptions.length > 0 ? (
                cadanganOptions.map(o => (
                  <SelectItem key={o.id} value={String(o.id)}>
                    {o.label}
                  </SelectItem>
                ))
              ) : (
                <SelectItem disabled value="">
                  Tidak ada sampel cadangan
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Aksi */}
        <div className="flex justify-end mt-6 space-x-2">
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button onClick={handleSubmit} disabled={isSaveDisabled}>
            Simpan
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
