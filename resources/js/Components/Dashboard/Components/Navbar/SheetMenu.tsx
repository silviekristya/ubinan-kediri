import { Link, usePage } from '@inertiajs/react';
import { FaBars } from "react-icons/fa6";
import { Button } from "@/Components/ui/button";
import { Menu } from "@/Components/Dashboard/Components/Dashboard/Menu";
import {
  Sheet,
  SheetHeader,
  SheetContent,
  SheetTrigger,
  SheetTitle
} from "@/Components/ui/sheet";

export function SheetMenu() {
    const { auth } = usePage().props;

    let userRole: string = auth?.user?.role ?? '';


    return (
        <Sheet>
            <SheetTrigger className="lg:hidden" asChild>
                <Button className="h-8" variant="outline" size="icon">
                <FaBars size={20} />
                </Button>
            </SheetTrigger>
            {/* <SheetContent className="sm:w-72 px-3 h-full flex flex-col bg-[url('/assets/img/bg-sidebar.webp')]" side="left"> */}
            <SheetContent className="sm:w-72 px-3 h-full flex flex-col')]" side="left">
                <SheetHeader className='flex w-full'>
                    <Button
                        className="flex justify-center items-center pb-2 pt-1"
                        variant="link"
                        asChild
                    >
                        <Link href={route('dashboard.beranda')} className="flex items-center gap-2">
                        {/* Ganti next/image dengan tag img biasa */}
                        <img src="/assets/img/logo.webp" width={100} height={30} alt="Ubinan Kediri" className="w-auto h-auto max-h-6" />
                        <SheetTitle className="text-center">
                            <div className="hidden min-[240px]:block font-bold text-base">
                            Ubinan Kediri
                            </div>
                            <div className="hidden min-[360px]:block text-xs">
                            BPS Kabupaten Kediri
                            </div>
                        </SheetTitle>
                        </Link>
                    </Button>
                    <Menu isOpen userRole={userRole} />
                </SheetHeader>
            </SheetContent>
        </Sheet>
  );
}
