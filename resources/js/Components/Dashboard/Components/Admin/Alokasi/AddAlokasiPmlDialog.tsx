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
import { Sampel, Tim } from '@/types';

interface AddPmlAllocationsDialogProps {
  isOpen: boolean;
  sampel: Sampel;
  onClose: () => void;
  onAllocationSuccess: (timId: number) => void;
  tim: Tim[];
}

const PmlAllocationsDialog: React.FC<AddPmlAllocationsDialogProps> = ({
  isOpen,
  sampel,
  onClose,
  onAllocationSuccess,
  tim,
}) => {
  const [selectedTimId, setSelectedTimId] = useState<number>(sampel.tim_id || 0);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Debug log untuk memastikan data tim diterima
  useEffect(() => {
    console.log("Data tim yang diterima:", tim);
  }, [tim]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    console.log("Mengirim payload:", { tim_id: selectedTimId });
    try {
      // Pastikan menggunakan sampel.id sebagai parameter URL
      await axios.put(`/dashboard/admin/alokasi/update/sampel/${sampel.id}/pml`, {
        tim_id: selectedTimId,
      });
      console.log("Update PML berhasil, tim_id:", selectedTimId);
      onAllocationSuccess(selectedTimId);
    } catch (error) {
      console.error("Error saat menyimpan PML:", error);
      setErrorMessage('Gagal menyimpan PML');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Pilih PML untuk Sampel {sampel.id}</DialogTitle>
          <DialogDescription>
            Pilih PML yang akan dialokasikan untuk sampel ini.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Dropdown PML */}
            <div className="grid grid-cols-1 gap-2">
              <label className="text-sm font-medium">PML (Tim)</label>
              <Select
                value={selectedTimId ? selectedTimId.toString() : ''}
                onValueChange={(value) => {
                  console.log("Nilai dipilih:", value);
                  setSelectedTimId(Number(value));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih PML" />
                </SelectTrigger>
                <Portal>
                  <SelectContent position="popper" className="z-[9999]">
                  {tim.map((item) => (
                      <SelectItem key={item.id} value={item.id.toString()}>
                        {/* Tampilkan nama PML dari objek pml */}
                        {item.pml && item.pml.nama ? item.pml.nama : 'Nama PML tidak tersedia'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Portal>
              </Select>
            </div>
            {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading || !selectedTimId}>
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

export default PmlAllocationsDialog;
