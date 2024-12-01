import { PiWebhooksLogoFill } from "react-icons/pi";
interface HeaderProps {
    label: string;
};

export const Header = ({
    label
}: HeaderProps) => {
    return (
        <>
            <div className="w-full flex flex-col gap-y-1 items-center justify-center">
                <img src="/assets/img/logo.webp" alt="Ubinan Kediri" className="h-12 w-auto" />
                <h1 className="font-bold">
                    Ubinan Kediri
                </h1>
                <p className="text-muted-foreground text-sm">{label}</p>
            </div>
        </>
    );
}
