import { FormEventHandler, useState, useTransition } from 'react';
import AuthLayout from '@/Layouts/AuthLayout';
import { Head, useForm } from '@inertiajs/react';
import { CardWrapper } from '@/Components/Auth/CardWrapper/Index';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Button } from '@/Components/ui/button';
import { toast } from 'react-toastify';
import { Loader2 } from "lucide-react";

export default function ResetPassword({ token, email }: { token: string, email: string }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const [isPending, startTransition] = useTransition();

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        startTransition(() => {
            toast.promise(
                new Promise((resolve, reject) => {
                    post(route('password.store'), {
                        onFinish: () => reset('password', 'password_confirmation'),
                        onError: () => {
                            reject(new Error('Failed to reset password.'));
                        },
                        onSuccess: () => {
                            resolve(undefined);
                        },
                    });
                }),
                {
                    pending: 'Resetting password...',
                    success: 'Password reset successful!',
                    error: {
                        render: ({ data }: { data: Error }) => `Failed to reset password: ${data.message}`,
                    },
                }
            );
        });
    };

    return (
        <>
            <Head title="Reset Password" />
            <AuthLayout>
                <CardWrapper
                    headerLabel="Reset Password"
                    backButtonLabel="Go Back to"
                    backButtonHref="/login"
                    backButtonLabelHref='Login'
                >
                    <form onSubmit={submit} className="space-y-4">
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
                            <Label htmlFor="password" className={errors.password ? 'text-red-500' : ''}>
                                Password
                            </Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                disabled={isPending}
                                placeholder="Password"
                                className={errors.password ? 'border-red-500' : ''}
                            />
                            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                        </div>

                        <div className="space-y-2 mt-4">
                            <Label htmlFor="password_confirmation" className={errors.password_confirmation ? 'text-red-500' : ''}>
                                Confirm Password
                            </Label>
                            <Input
                                id="password_confirmation"
                                name="password_confirmation"
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                disabled={isPending}
                                placeholder="Confirm Password"
                                className={errors.password_confirmation ? 'border-red-500' : ''}
                            />
                            {errors.password_confirmation && <p className="text-red-500 text-sm">{errors.password_confirmation}</p>}
                        </div>

                        <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Resetting...
                                </>
                            ) : (
                                "Reset Password"
                            )}
                        </Button>
                    </form>
                </CardWrapper>
            </AuthLayout>
        </>
    );
}
