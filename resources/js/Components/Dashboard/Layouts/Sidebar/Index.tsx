import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { Menu } from '@/Components/Dashboard/Components/Dashboard/Menu';
import { SidebarToggle } from '@/Components/Dashboard/Components/Dashboard/SidebarToggle';

interface SidebarDashboardProps {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function SidebarDashboard({ sidebarOpen, setSidebarOpen }: SidebarDashboardProps) {
  const { auth } = usePage().props;
  const isOpen = sidebarOpen; // Gunakan `sidebarOpen` dari props

  let userRole: string = auth?.user?.role ?? '';

  return (
    // <aside
    //   className={cn(
    //     "bg-[url('/assets/img/bg-sidebar.webp')] fixed top-0 left-0 z-20 h-screen -translate-x-full lg:translate-x-0 transition-[width] ease-in-out duration-300",
    //     isOpen === false ? "w-[90px]" : "w-72"
    //   )}
    // >
    <aside
      className={cn(
        "fixed top-0 left-0 z-20 h-screen -translate-x-full lg:translate-x-0 transition-[width] ease-in-out duration-300",
        isOpen === false ? "w-[90px]" : "w-72"
      )}
    >
      <SidebarToggle isOpen={isOpen} setIsOpen={() => setSidebarOpen(!isOpen)} />
      <div className="relative h-full flex flex-col px-3 py-4 overflow-y-auto shadow-md dark:shadow-zinc-800">
        <Button
          className={cn(
            "transition-transform ease-in-out duration-300 mb-1",
            isOpen === false ? "translate-x-1" : "translate-x-0"
          )}
          variant="link"
          asChild
        >
          <div className="hover:no-underline">
            <Link href={route('dashboard.beranda')} className="flex items-center gap-2">
              <img src="/assets/img/logo.webp" width={100} height={30} alt="Ubinan Kediri" className={cn("w-auto h-auto max-h-6", isOpen === false ? 'mr-1' : '')} />
              <div className="text-center">
                <h1
                  className={cn(
                    "font-bold text-base whitespace-nowrap transition-[transform,opacity,display] ease-in-out duration-300",
                    isOpen === false
                      ? "-translate-x-96 opacity-0 hidden"
                      : "translate-x-0 opacity-100"
                  )}
                >
                  Ubinan Kediri
                </h1>
                <p
                  className={cn(
                    "font-medium text-xs whitespace-nowrap transition-[transform,opacity,display] ease-in-out duration-300",
                    isOpen === false
                      ? "-translate-x-96 opacity-0 hidden"
                      : "translate-x-0 opacity-100"
                  )}
                >
                  BPS Kabupaten Kediri
                </p>
              </div>
            </Link>
          </div>
        </Button>
        <Menu isOpen={isOpen} userRole={userRole} />
      </div>
    </aside>
  );
}
