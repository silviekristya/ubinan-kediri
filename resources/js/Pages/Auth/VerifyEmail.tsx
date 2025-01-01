import { FormEventHandler, useState, useTransition } from 'react';
import AuthLayout from '@/Layouts/AuthLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { CardWrapper } from '@/Components/Auth/CardWrapper/Index';
import { Button } from '@/Components/ui/button';
import { toast } from 'react-toastify';
import { Loader2 } from "lucide-react";

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});
    const [isPending, startTransition] = useTransition();

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        startTransition(() => {
            toast.promise(
                new Promise((resolve, reject) => {
                    post(route('verification.send'), {
                        onError: () => {
                            reject(new Error('Failed to send verification email.'));
                        },
                        onSuccess: () => {
                            resolve(undefined);
                        },
                    });
                }),
                {
                    pending: 'Sending verification email...',
                    success: 'Verification email sent!',
                    error: {
                        render: ({ data }: { data: Error }) => `Failed to send email: ${data.message}`,
                    },
                }
            );
        });
    };

    return (
        <>
            <Head title="Email Verification" />
            <AuthLayout>
                <CardWrapper
                    headerLabel="Email Verification"
                    backButtonLabel="Go Back to"
                    backButtonHref="/login"
                    backButtonLabelHref='Login'
                >
                    <div className="mb-4 text-sm text-gray-600">
                        Thanks for signing up! Before getting started, could you verify your email address by clicking on the
                        link we just emailed to you? If you didn't receive the email, we will gladly send you another.
                    </div>

                    {status === 'verification-link-sent' && (
                        <div className="mb-4 font-medium text-sm text-green-600">
                            A new verification link has been sent to the email address you provided during registration.
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-4">
                        <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                "Resend Verification Email"
                            )}
                        </Button>

                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Log Out
                        </Link>
                    </form>
                </CardWrapper>
            </AuthLayout>
        </>
    );
}
