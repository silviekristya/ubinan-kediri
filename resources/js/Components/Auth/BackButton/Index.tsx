import { Button } from "@/Components/ui/button";
import { Link } from '@inertiajs/react';

interface BackButtonProps {
    label: string;
    labelhref: string;
    href: string;
};

export const BackButton = ({
    label,
    labelhref,
    href
}: BackButtonProps) => {
    return (
        <>
            <div className="flex justify-center w-full py-2">
                <div className="flex items-center font-normal text-xs">
                    <div>
                        {label}
                    </div>
                    <span
                        className="font-semibold p-0.5 text-xs hover:text-blue-bps-medium cursor-pointer duration-300"
                    >
                        <Link href={href}>
                            {labelhref}
                        </Link>
                    </span>
                </div>
            </div>
        </>
    );
};
