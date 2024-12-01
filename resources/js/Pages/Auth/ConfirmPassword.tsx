import { FormEventHandler, useState, useTransition } from 'react';
import AuthLayout from '@/Layouts/AuthLayout';
import { Head, useForm } from '@inertiajs/react';
import { CardWrapper } from '@/Components/Auth/CardWrapper/Index';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Button } from '@/Components/ui/button';
import { toast } from 'react-toastify';
import { Loader2 } from "lucide-react";

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | undefined>('');
    const [success, setSuccess] = useState<string | undefined>('');

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        startTransition(() => {
            toast.promise(
                new Promise((resolve, reject) => {
                    post(route('password.confirm'), {
                        onFinish: () => reset('password'),
                        onError: (errors) => {
                            setError('Password confirmation failed.');
                            reject(new Error('Password confirmation failed.'));
                        },
                        onSuccess: () => {
                            setSuccess('Password confirmed successfully!');
                            resolve(undefined);
                        },
                    });
                }),
                {
                    pending: 'Confirming password...',
                    success: 'Password confirmed successfully!',
                    error: {
                        render: ({ data }: { data: Error }) => `Error: ${data.message}`,
                    },
                }
            );
        });
    };

    return (
        <>
            <Head title="Confirm Password" />
            <AuthLayout>
                <CardWrapper
                    headerLabel="Confirm Password"
                    backButtonLabel="Go Back"
                    backButtonLabelHref='Login'
                    backButtonHref="/login"
                >
                    <div className="mb-4 text-sm text-gray-600">
                        This is a secure area of the application. Please confirm your password before continuing.
                    </div>

                    <form onSubmit={submit} className="space-y-4">
                        <div className="space-y-2">
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
                            {errors.password && <p className="text-red-500">{errors.password}</p>}
                        </div>

                        <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Confirming...
                                </>
                            ) : (
                                "Confirm"
                            )}
                        </Button>
                    </form>
                </CardWrapper>
            </AuthLayout>
        </>
    );
}
