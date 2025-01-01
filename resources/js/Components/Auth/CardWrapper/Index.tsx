'use client';

import {
    Card,
    CardContent,
    CardHeader,
    CardFooter,
 } from "@/Components/ui/card";
import { Header } from "@/Components/Auth/HeaderCard/Index";
import { BackButton } from "@/Components/Auth/BackButton/Index";

interface CardWrapperProps {
    children: React.ReactNode;
    headerLabel: string;
    backButtonLabel: string;
    backButtonLabelHref: string;
    backButtonHref: string;
    showSocial?: boolean;
};

export const CardWrapper = ({
    children,
    headerLabel,
    backButtonLabel,
    backButtonLabelHref,
    backButtonHref,
}: CardWrapperProps) => {
    return (
        <>
            <Card className="w-full max-w-[400px] sm:w-[600px] sm:max-w-full shadow-md">
                <CardHeader>
                    <Header label={headerLabel} />
                </CardHeader>
                <CardContent className="pb-0">
                    {children}
                </CardContent>
                <BackButton
                    label={backButtonLabel}
                    labelhref={backButtonLabelHref}
                    href={backButtonHref}
                />
            </Card>
        </>
    )};
