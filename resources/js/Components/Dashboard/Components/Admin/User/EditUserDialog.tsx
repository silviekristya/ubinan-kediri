import { useState, useEffect, FormEventHandler } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { usePage, useForm } from '@inertiajs/react';
import { Loader2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/Components/ui/popover";
import { Command, CommandGroup, CommandInput, CommandItem, CommandList, CommandEmpty } from "@/Components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { User, WithCsrf, PageProps } from '@/types';

interface UserFormData extends User, WithCsrf {}

interface EditDialogUserProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: UserFormData) => Promise<void>;
  data: User;
}

export const EditUserDialog = ({ isOpen, onClose, onSave, data }: EditDialogUserProps) => {
  const { csrf_token } = usePage<PageProps>().props;
  const roles = [
    { id: 'ADMIN', nama: 'Admin' },
    { id: 'USER', nama: 'User' },
];

  const [nama, setNama] = useState(data.nama);
  const [role, setRole] = useState(data.role);
  const [openRole, setOpenRole] = useState(false);

  const { processing, errors } = useForm<UserFormData>({
    ...data,
    _token: csrf_token,
  });

  useEffect(() => {
    if (isOpen) {
      setNama(data.nama);
      setRole(data.role);
    }
  }, [isOpen, data]);

  const handleSubmit: FormEventHandler = async (e) => {
    e.preventDefault();
    try {
      await onSave({ id: data.id, nama: data.nama, email: data.email, role, _token: csrf_token });
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>Edit data user {data.nama}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input type="hidden" name="_token" value={csrf_token} />

          {/* Nama User */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="nama">Nama</Label>
            <Input
              id="nama"
              name="nama"
              placeholder="Masukkan nama pengguna"
              defaultValue={data.nama}
              disabled
            />
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Popover open={openRole} onOpenChange={setOpenRole}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between"
                >
                  {role || "Pilih Role..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0 max-h-60 overflow-y-auto">
                <Command>
                  <CommandList>
                    <CommandEmpty>No roles found.</CommandEmpty>
                    <CommandGroup>
                      {roles.map((r) => (
                        <CommandItem
                          key={r.id}
                          onSelect={() => {
                            setRole(r.id);
                            setOpenRole(false);
                          }}
                        >
                          <Check
                            className={`mr-2 h-4 w-4 ${role === r.id ? "opacity-100" : "opacity-0"}`}
                          />
                          {r.nama}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
          </div>

          {/* Tombol Aksi */}
          <div className="flex justify-end space-x-4">
            <Button type="submit" disabled={processing}>
              {processing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Perbarui'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog;
