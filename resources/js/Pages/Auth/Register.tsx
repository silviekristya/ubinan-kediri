import { FormEventHandler, useState, useTransition } from 'react';
import AuthLayout from '@/Layouts/AuthLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { CardWrapper } from '@/Components/Auth/CardWrapper/Index';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Button } from '@/Components/ui/button';
import { toast } from 'react-toastify';
import { Loader2, Eye, EyeOff, Check, ChevronsUpDown } from "lucide-react";
import { Textarea } from "@/Components/ui/textarea";

import { cn } from "@/lib/utils";

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
  } from "@/Components/ui/command";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/Components/ui/popover";


export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        nama: '',
        email: '',
        no_telepon: '',
        password: '',
        password_confirmation: '',
    });

    const [isPending, startTransition] = useTransition();

    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);

    const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
    const toggleConfirmPasswordVisibility = () => setShowConfirmPassword((prev) => !prev);


    const onSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        startTransition(() => {
            toast.promise(
                new Promise((resolve, reject) => {
                    post(route('register'), {
                        onFinish: () => {
                            reset('password', 'password_confirmation');
                            resolve(undefined);
                        },
                        onError: () => {
                            reject(new Error('Registration failed.'));
                        },
                        onSuccess: () => {
                            resolve(undefined);
                        },
                    });
                }),
                {
                    pending: 'Processing registration...',
                    success: 'Registration successful!',
                    error: {
                        render: ({ data }: { data: Error }) => `Failed to register: ${data.message}`,
                    },
                }
            );
        });
    };

    return (
        <>
            <Head title="Login" />
            <AuthLayout>
                <Head title="Register" />
                <CardWrapper headerLabel="Register" backButtonLabel="Already have an account?" backButtonLabelHref="Login" backButtonHref="/login">
                    <form onSubmit={onSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 gap-2">
                            {/* Field Name */}
                            <div className="space-y-2">
                                <Label htmlFor="nama" className={errors.nama ? 'text-red-500' : ''}>
                                    Nama
                                </Label>
                                <Input
                                    id="nama"
                                    name="nama"
                                    type="text"
                                    value={data.nama}
                                    onChange={(e) => setData('nama', e.target.value)}
                                    disabled={isPending}
                                    placeholder="Nama"
                                    required
                                    className={errors.nama ? 'border-red-500' : ''}
                                />
                                {errors.nama && <p className="text-red-500 text-sm">{errors.nama}</p>}
                            </div>

                            {/* Field Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email" className={errors.email ? 'text-red-500' : ''}>
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    disabled={isPending}
                                    placeholder="Email"
                                    required
                                    className={errors.email ? 'border-red-500' : ''}
                                />
                                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                            </div>

                            {/* Field No Telepon */}
                            <div className="space-y-2">
                                <Label htmlFor="phone" className={errors.no_telepon ? 'text-red-500' : ''}>
                                    No Telepon
                                </Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    value={data.no_telepon}
                                    onChange={(e) => setData('no_telepon', e.target.value)}
                                    disabled={isPending}
                                    placeholder="No Telepon"
                                    required
                                    className={errors.no_telepon ? 'border-red-500' : ''}
                                />
                                {errors.no_telepon && <p className="text-red-500 text-sm">{errors.no_telepon}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {/* Field Name */}
                            <div className="space-y-2">
                                <Label htmlFor="password" className={errors.password ? 'text-red-500' : ''}>Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        disabled={isPending}
                                        placeholder="Password"
                                        required
                                        className={errors.password ? 'border-red-500' : ''}
                                    />
                                    <span
                                        role="button"
                                        aria-label={showPassword ? 'Sembunyikan Password' : 'Tampilkan Password'}
                                        onClick={togglePasswordVisibility}
                                        className="absolute inset-y-0 right-0 px-3 flex items-center"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </span>
                                </div>
                                {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password_confirmation" className={errors.password_confirmation ? 'text-red-500' : ''}>Confirm Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        disabled={isPending}
                                        placeholder="Confirm Password"
                                        required
                                        className={errors.password_confirmation ? 'border-red-500' : ''}
                                    />
                                    <span
                                        role="button"
                                        aria-label={showConfirmPassword ? 'Sembunyikan Password' : 'Tampilkan Password'}
                                        onClick={toggleConfirmPasswordVisibility}
                                        className="absolute inset-y-0 right-0 px-3 flex items-center"
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </span>
                                </div>
                                {errors.password_confirmation && <p className="text-red-500 text-sm">{errors.password_confirmation}</p>}
                            </div>
                        </div>

                        <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending ? (
                                <>
                                    <Loader2 className="=h-4 w-4 animate-spin" />
                                    Loading...
                                </>
                            ) : (
                                "Register"
                            )}
                        </Button>
                    </form>
                </CardWrapper>
            </AuthLayout>
        </>
    );
}
