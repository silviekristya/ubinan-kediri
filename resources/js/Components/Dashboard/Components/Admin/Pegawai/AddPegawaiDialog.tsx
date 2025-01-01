import { useState, FormEventHandler, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { usePage, useForm } from '@inertiajs/react';
import { Loader2 } from "lucide-react";
import { Pegawai, WithCsrf, PageProps, User } from '@/types';
import { Checkbox } from "@/Components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Badge } from '@/Components/ui/badge';
import { rolePegawai } from "@/Components/Dashboard/Components/Admin/Pegawai/DataTableFilterPegawai";
import { Popover, PopoverContent, PopoverTrigger } from "@/Components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/Components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";

interface PegawaiFormData extends Omit<Pegawai, 'id' | 'user_id'>, WithCsrf {
    user_id: string;
}

interface AddPegawaiDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: PegawaiFormData) => Promise<void>;
    users: User[];
}

export const AddPegawaiDialog = ({ isOpen, onClose, onSave, users }: AddPegawaiDialogProps) => {
  const { csrf_token } = usePage<PageProps>().props;

  const [nama, setNama] = useState("");
  const [noTelepon, setNoTelepon] = useState("");
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<'ADMIN' | 'PEGAWAI'>("PEGAWAI");
  const [isPml, setIsPml] = useState(false);
  const [userId, setUserId] = useState("");

  const { processing, errors } = useForm<PegawaiFormData>({
    nama: "",
    no_telepon: "",
    role: "PEGAWAI",
    is_pml: false,
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
            role,
            is_pml: isPml,
            user_id: userId, // Mengirimkan user_id yang dipilih
            _token: csrf_token,
        });

        // Reset form setelah berhasil
        onClose();
        setNama("");
        setNoTelepon("");
        setRole("PEGAWAI");
        setIsPml(false);
        setUserId(""); // Reset user_id
    } catch (error) {
        console.error(error);
    }
};


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Pegawai Baru</DialogTitle>
          <DialogDescription>Masukkan data pegawai baru</DialogDescription>
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
            <Label htmlFor="noTelepon">No HP</Label>
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
                <Select value={role} onValueChange={(value) => setRole(value as 'ADMIN' | 'PEGAWAI')}>
                    <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih Role">
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
                {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
            </div>

            {/* Is PML */}
            <div className="flex items-center space-x-2">
                <Checkbox
                    id="isPml"
                    checked={isPml}
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
              {processing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Simpan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
