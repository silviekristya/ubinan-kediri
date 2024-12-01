import { FormEventHandler, useState, useTransition } from 'react';
import AuthLayout from '@/Layouts/AuthLayout';
import { Head, useForm } from '@inertiajs/react';
import { CardWrapper } from '@/Components/Auth/CardWrapper/Index';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Button } from '@/Components/ui/button';
import { toast } from 'react-toastify';
import { Loader2 } from "lucide-react";

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
    });

    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | undefined>('');
    const [success, setSuccess] = useState<string | undefined>('');

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        startTransition(() => {
            toast.promise(
                new Promise((resolve, reject) => {
                    post(route('password.email'), {
                        onFinish: () => {
                            setSuccess('Password reset link sent to your email!');
                            reset('email');
                            resolve(undefined);
                        },
                        onError: (errors) => {
                            setError('Failed to send reset link.');
                            reject(new Error(`${errors.email}`));
                        },
                        onSuccess: () => {
                            resolve(undefined);
                        },
                    });
                }),
                {
                    pending: 'Sending password reset link...',
                    success: 'Password reset link sent!',
                    error: {
                        render: ({ data }: { data: Error }) => `Error: ${data.message}`,
                    },
                }
            );
        });
    };

    return (
        <>
            <Head title="Forgot Password" />
            <AuthLayout>
                <CardWrapper
                    headerLabel="Forgot Password"
                    backButtonLabel="Go Back to"
                    backButtonLabelHref='Login'
                    backButtonHref="/login"
                >
                    {status && <div className="mb-4 font-medium text-sm text-green-600">{status}</div>}

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

                        <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                "Email Password Reset Link"
                            )}
                        </Button>
                    </form>
                </CardWrapper>
            </AuthLayout>
        </>
    );
}
