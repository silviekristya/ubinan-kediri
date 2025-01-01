import { FormEventHandler, useState, useTransition } from 'react';
import AuthLayout from '@/Layouts/AuthLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { CardWrapper } from '@/Components/Auth/CardWrapper/Index';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Button } from '@/Components/ui/button';
import { toast } from 'react-toastify';
import { Loader2, Eye, EyeOff } from "lucide-react";
import { Checkbox } from '@/Components/ui/checkbox';

interface PageProps {
    csrf_token: string;
}

export default function Login({ status, canResetPassword }: { status?: string, canResetPassword: boolean }) {
    const { csrf_token } = usePage().props as PageProps;
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
        _token: csrf_token,
    });

    const [error, setError] = useState<string | undefined>('');
    const [success, setSuccess] = useState<string | undefined>('');
    const [isPending, startTransition] = useTransition();
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

    const onSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        startTransition(() => {
            toast.promise(
                new Promise((resolve, reject) => {
                    post(route('login'), {
                        onFinish: () => {
                            reset('password');
                            resolve(undefined);
                        },
                        onError: (errors) => {
                            reject(new Error('Invalid email or password.'));
                        },
                        onSuccess: () => {
                            setSuccess('Login successful!');
                            resolve(undefined);
                        },
                    });
                }),
                {
                    pending: 'Logging in...',
                    success: 'Login successful!',
                    error: {
                        render: ({ data }: { data: Error }) => `Failed to login: ${data.message}`,
                    },
                }
            );
        });
    };

    return (
        <>
            <Head title="Login" />
            <AuthLayout>
                <CardWrapper
                    headerLabel="Login"
                    backButtonLabel="Don't have an account?"
                    backButtonLabelHref="Register"
                    backButtonHref="/register"
                >
                    <form onSubmit={onSubmit} className="space-y-4">
                        <input type="hidden" name="_token" value={csrf_token} />

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
                                className={errors.email ? 'border-red-500' : ''}
                            />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                        </div>

                        <div className="space-y-2 mt-4">
                            <Label htmlFor="password" className={errors.password ? 'text-red-500' : errors.email ? 'text-red-500' : ''}>
                                Password
                            </Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'} // Kontrol tipe input
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    disabled={isPending}
                                    placeholder="Password"
                                    className={errors.password ? 'border-red-500' : errors.email ? 'border-red-500' : ''}
                                />
                                <span
                                    onClick={togglePasswordVisibility}
                                    className="absolute inset-y-0 right-0 px-3 flex items-center cursor-pointer"
                                    role="button"
                                    aria-label={showPassword ? 'Sembunyikan Password' : 'Tampilkan Password'}
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </span>
                            </div>
                            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

                            <div className="grid grid-cols-2 items-center">
                                <div className="flex items-center space-x-2 pt-2">
                                    <Checkbox
                                        id="remember"
                                        name="remember"
                                        checked={Boolean(data.remember)}
                                        onCheckedChange={(checked: boolean) => setData('remember', checked)}
                                        disabled={isPending}
                                    />
                                    <label
                                        htmlFor="remember"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        Ingat saya
                                    </label>
                                </div>
                                <span
                                    className="px-0 font-bold flex justify-end text-xs hover:text-blue-bps-medium cursor-pointer duration-300"
                                >
                                    <Link href="/forgot-password">Lupa Password?</Link>
                                </span>
                            </div>
                        </div>

                        <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Loading...
                                </>
                            ) : (
                                "Login"
                            )}
                        </Button>
                    </form>
                </CardWrapper>
            </AuthLayout>
        </>
    );
}
