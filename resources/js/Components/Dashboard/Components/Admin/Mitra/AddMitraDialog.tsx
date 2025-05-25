import { useState, FormEventHandler, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { usePage, useForm } from '@inertiajs/react';
import { ALargeSmall, AlarmCheck, Loader2 } from "lucide-react";
import { Mitra, WithCsrf, PageProps, User } from '@/types';
import { Popover, PopoverContent, PopoverTrigger } from "@/Components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/Components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";

interface MitraFormData extends Omit<Mitra, 'id' | 'user_id'>, WithCsrf {
    user_id: string;
}

interface AddMitraDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: MitraFormData) => Promise<void>;
    users: User[];
}

export const AddMitraDialog = ({ isOpen, onClose, onSave, users }: AddMitraDialogProps) => {
  const { csrf_token } = usePage<PageProps>().props;

  const [nama, setNama] = useState("");
  const [noTelepon, setNoTelepon] = useState("");
  const [alamat, setAlamat] = useState("");
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState("");

  const { processing, errors } = useForm<MitraFormData>({
    nama: "",
    no_telepon: "",
    alamat: "",
    user_id: "",
    _token: csrf_token,
  });

  const handleSubmit: FormEventHandler = async (e) => {
    e.preventDefault();

    try {
        // Kirim data termasuk user_id yang dipilih
        await onSave({
            nama,
            no_telepon: noTelepon,
            alamat: alamat,
            user_id: userId, // Mengirimkan user_id yang dipilih
            _token: csrf_token,
        });

        // Reset form setelah berhasil
        onClose();
        setNama("");
        setNoTelepon("");
        setAlamat("");
        setUserId(""); // Reset user_id
    } catch (error) {
        console.error(error);
    }
};


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Mitra Baru</DialogTitle>
          <DialogDescription>Masukkan data mitra baru</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input type="hidden" name="_token" value={csrf_token} />

          {/* User Selection */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="user">User</Label>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                    >
                        {users?.find((user) => String(user.id) === userId)?.username || "Pilih User"}
                        <ChevronsUpDown className="opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                    <Command>
                        <CommandInput placeholder="Cari user..." />
                        <CommandList>
                            <CommandEmpty>Tidak ada user ditemukan.</CommandEmpty>
                            <CommandGroup>
                                {users?.map((user) => (
                                    <CommandItem
                                        key={String(user.id)}
                                        value={String(user.id)}
                                        onSelect={() => {
                                            setUserId(String(user.id)); // Set userId dengan nilai string
                                            setOpen(false); // Tutup popover
                                        }}
                                    >
                                        {user.username}
                                        <Check
                                            className={`ml-auto ${
                                                userId === String(user.id) ? 'opacity-100' : 'opacity-0'
                                            }`}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
          </div>

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

          {/* Phone */}
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
              {processing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Simpan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
