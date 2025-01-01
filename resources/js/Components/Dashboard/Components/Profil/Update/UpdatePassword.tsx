import { useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { FormEventHandler, useState } from 'react';
import { toast } from 'react-toastify';

export const UpdatePasswordComponents = () => {
    const { put, reset, setData, data, errors, processing } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const [isFormChanged, setIsFormChanged] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleInputChange = (
        field: 'current_password' | 'password' | 'password_confirmation',
        value: string
    ) => {
        setData(field, value);
        setIsFormChanged(true);
    };

    const togglePasswordVisibility = (type: 'current' | 'password' | 'confirm') => {
        if (type === 'current') setShowCurrentPassword((prev) => !prev);
        if (type === 'password') setShowPassword((prev) => !prev);
        if (type === 'confirm') setShowConfirmPassword((prev) => !prev);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        toast.promise(
            new Promise((resolve, reject) => {
                put(route('dashboard.password.update'), {
                    onFinish: () => {
                        reset();
                        setIsFormChanged(false);
                        resolve(undefined);
                    },
                    onError: (errors) => {
                        reject(new Error('Gagal memperbarui password.'));
                    },
                });
            }),
            {
                pending: 'Memproses...',
                success: 'Password berhasil diperbarui!',
                error: {
                    render: ({ data }: { data: Error }) => `Gagal: ${data.message}`,
                },
            }
        );
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Ubah Password</CardTitle>
                <CardDescription>Ganti kata sandi akun Anda.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <Label htmlFor="current_password">Password Lama</Label>
                        <div className="relative">
                            <Input
                                id="current_password"
                                type={showCurrentPassword ? 'text' : 'password'}
                                value={data.current_password}
                                onChange={(e) => handleInputChange('current_password', e.target.value)}
                                disabled={processing}
                                required
                                placeholder="Masukkan password lama"
                            />
                            <span
                                role="button"
                                aria-label={showCurrentPassword ? 'Sembunyikan Password' : 'Tampilkan Password'}
                                onClick={() => togglePasswordVisibility('current')}
                                className="absolute inset-y-0 right-0 px-3 flex items-center"
                            >
                                {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </span>
                        </div>
                        {errors.current_password && (
                            <p className="text-red-500 text-sm">{errors.current_password}</p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="password">Password Baru</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={data.password}
                                onChange={(e) => handleInputChange('password', e.target.value)}
                                disabled={processing}
                                required
                                placeholder="Masukkan password baru"
                            />
                            <span
                                role="button"
                                aria-label={showPassword ? 'Sembunyikan Password' : 'Tampilkan Password'}
                                onClick={() => togglePasswordVisibility('password')}
                                className="absolute inset-y-0 right-0 px-3 flex items-center"
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </span>
                        </div>
                        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                    </div>

                    <div>
                        <Label htmlFor="password_confirmation">Konfirmasi Password Baru</Label>
                        <div className="relative">
                            <Input
                                id="password_confirmation"
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={data.password_confirmation}
                                onChange={(e) => handleInputChange('password_confirmation', e.target.value)}
                                disabled={processing}
                                required
                                placeholder="Konfirmasi password baru"
                            />
                            <span
                                role="button"
                                aria-label={showConfirmPassword ? 'Sembunyikan Password' : 'Tampilkan Password'}
                                onClick={() => togglePasswordVisibility('confirm')}
                                className="absolute inset-y-0 right-0 px-3 flex items-center"
                            >
                                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </span>
                        </div>
                        {errors.password_confirmation && (
                            <p className="text-red-500 text-sm">{errors.password_confirmation}</p>
                        )}
                    </div>

                    <Button type="submit" disabled={!isFormChanged || processing}>
                        {processing ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Menyimpan...
                            </span>
                        ) : (
                            'Simpan Perubahan'
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};
