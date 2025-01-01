import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/Components/ui/popover";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/Components/ui/command";
import { ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from 'react-toastify';

interface UpdateProfilProps {
  user: any;
  onUpdate: (user: any) => void;
}

export const UpdateProfilComponents = ({ user, onUpdate }: UpdateProfilProps) => {
    const { data, setData, patch, errors, processing, reset } = useForm({
      nama: user.nama,
      email: user.email,
      no_telepon: user.no_telepon,
    });

    const [isChanged, setIsChanged] = useState(false);

    useEffect(() => {
        const isDataChanged: boolean =
            data.nama !== user.nama ||
            data.email !== user.email ||
            data.no_telepon !== user.no_telepon;

        setIsChanged(isDataChanged);
    }, [data, user]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        toast.promise(
            new Promise((resolve, reject) => {
                patch(route('dashboard.profil.update'), {
                    onSuccess: () => {
                        onUpdate(data);
                        reset();
                        resolve('Data berhasil diperbarui.');
                    },
                    onError: (error) => {
                        console.error(error);
                        reject(new Error('Gagal memperbarui profil.'));
                    },
                });
            }),
            {
                pending: 'Memproses...',
                success: 'Profil berhasil diperbarui!',
                error: {
                    render({ data }: { data: Error }) {
                        return `Gagal: ${data.message}`;
                    },
                },
            }
        );
    };


    return (
        <Card>
        <CardHeader>
            <CardTitle>Ubah Profil</CardTitle>
            <CardDescription>Ubah informasi profil Anda.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <form onSubmit={submit} className="space-y-4">
                <div>
                    <Label htmlFor="nama" className={errors.nama ? 'text-red-500' : ''}>
                    Nama
                    </Label>
                    <Input
                    id="nama"
                    value={data.nama}
                    onChange={(e) => setData('nama', e.target.value)}
                    disabled={processing}
                    placeholder="Nama"
                    className={errors.nama ? 'border-red-500' : ''}
                    autoComplete="name"
                    required
                    />
                    {errors.nama && <p className="text-red-500 text-sm">{errors.nama}</p>}
                </div>

                <div>
                    <Label htmlFor="email" className={errors.email ? 'text-red-500' : ''}>
                    Email
                    </Label>
                    <Input
                    id="email"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    disabled={processing}
                    placeholder="Email"
                    className={errors.email ? 'border-red-500' : ''}
                    autoComplete="email"
                    required
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>

                <div>
                    <Label htmlFor="no_telepon" className={errors.no_telepon ? 'text-red-500' : ''}>
                    No Telepon
                    </Label>
                    <Input
                    id="no_telepon"
                    value={data.no_telepon}
                    onChange={(e) => setData('no_telepon', e.target.value)}
                    disabled={processing}
                    placeholder="No Telepon"
                    className={errors.no_telepon ? 'border-red-500' : ''}
                    autoComplete="tel"
                    required
                    />
                    {errors.no_telepon && <p className="text-red-500 text-sm">{errors.no_telepon}</p>}
                </div>

                <div className="flex items-center gap-4">
                    <Button type="submit" disabled={!isChanged || processing}>
                        {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </Button>
                </div>
            </form>
        </CardContent>
        </Card>
    );
};
