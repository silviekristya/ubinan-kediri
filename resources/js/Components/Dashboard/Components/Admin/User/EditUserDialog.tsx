import { useState, useEffect, FormEventHandler } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { usePage, useForm } from '@inertiajs/react';
import { Loader2 } from "lucide-react";
import { User, WithCsrf, PageProps } from '@/types';

interface UserFormData extends Omit<User, 'password'>, WithCsrf {
  password?: string;
}

interface EditDialogUserProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: UserFormData) => Promise<void>;
  data: User;
}

export const EditUserDialog = ({ isOpen, onClose, onSave, data }: EditDialogUserProps) => {
  const { csrf_token } = usePage<PageProps>().props;

  const [email, setEmail] = useState(data.email);
  const [username, setUsername] = useState(data.username);
  const [password, setPassword] = useState("");

  const { processing, errors } = useForm<UserFormData>({
    ...data,
    _token: csrf_token,
  });

  useEffect(() => {
    if (isOpen) {
      setEmail(data.email);
      setUsername(data.username);
      setPassword("");
    }
  }, [isOpen, data]);

  const handleSubmit: FormEventHandler = async (e) => {
    e.preventDefault();
    try {
      await onSave({
        id: data.id,
        email,
        username,
        password: password || undefined, // Hanya kirim password jika diisi
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
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>Edit data user</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input type="hidden" name="_token" value={csrf_token} />

          {/* Email */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              placeholder="Masukkan email pengguna"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          {/* Username */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              placeholder="Masukkan username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
          </div>

          {/* Password */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Kosongkan jika tidak ingin mengubah password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
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
