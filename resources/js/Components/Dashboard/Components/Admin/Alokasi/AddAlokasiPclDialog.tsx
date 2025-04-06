import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/Components/ui/dialog';
import { Button } from '@/Components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/Components/ui/select';
import { Portal } from '@radix-ui/react-portal';
import axios from 'axios';
import { Sampel } from '@/types';

interface PclOption {
  id: number;
  nama: string;
}

interface PclAllocationDialogProps {
  isOpen: boolean;
  sampel: Sampel;
  onClose: () => void;
  onAllocationSuccess: (pclId: number) => void;
}

const PclAllocationDialog: React.FC<PclAllocationDialogProps> = ({
  isOpen,
  sampel,
  onClose,
  onAllocationSuccess,
}) => {
  const [pclOptions, setPclOptions] = useState<PclOption[]>([]);
  const [selectedPclId, setSelectedPclId] = useState<number>(sampel.pcl_id || 0);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Pastikan sampel sudah memiliki tim_id; jika belum, tidak perlu memuat opsi PCL.
  useEffect(() => {
    if (sampel.tim_id) {
      axios
        .get(`/dashboard/admin/option/tim-pcl/${sampel.tim_id}/tim-pcl-available-list`)
        .then((res) => {
          console.log("Data PCL untuk tim", sampel.tim_id, ":", res.data.pcl);
          setPclOptions(res.data.pcl);
        })
        .catch((error) => {
          console.error("Gagal mengambil data PCL:", error);
          setPclOptions([]);
        });
    }
  }, [sampel.tim_id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    console.log("Mengirim payload:", { pcl_id: selectedPclId });
    try {
      // Pastikan menggunakan sampel.id sebagai parameter URL
      const response = await axios.put(`/dashboard/admin/alokasi/update/sampel/${sampel.id}/pcl`, {
        pcl_id: selectedPclId,
      });
      console.log("Update PCL berhasil:", response.data);
      onAllocationSuccess(selectedPclId);
    } catch (error) {
      console.error("Error saat menyimpan PCL:", error);
      setErrorMessage('Gagal menyimpan PCL');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Pilih PCL untuk Sampel #{sampel.id}</DialogTitle>
          <DialogDescription>
            Pilih PCL yang tersedia pada tim yang sudah dipilih. Pastikan sampel sudah memiliki PML.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Dropdown PCL */}
            <div className="grid grid-cols-1 gap-2">
              <label className="text-sm font-medium">PCL</label>
              <Select
                value={selectedPclId ? selectedPclId.toString() : ''}
                onValueChange={(value) => {
                  console.log("Nilai PCL dipilih:", value);
                  setSelectedPclId(Number(value));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih PCL" />
                </SelectTrigger>
                <Portal>
                  <SelectContent position="popper" className="z-[9999]">
                    {pclOptions.map((option) => (
                      <SelectItem key={option.id} value={option.id.toString()}>
                        {option.nama}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Portal>
              </Select>
            </div>
            {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading || !selectedPclId}>
              {loading ? 'Menyimpan...' : 'Simpan'}
            </Button>
            <DialogClose asChild>
              <Button variant="outline" type="button" onClick={onClose}>
                Batal
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PclAllocationDialog;
