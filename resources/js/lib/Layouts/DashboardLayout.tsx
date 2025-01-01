import { useState, PropsWithChildren, ReactNode, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { SidebarDashboard } from '@/Components/Dashboard/Layouts/Sidebar/Index';
import { cn } from "@/lib/utils";
import { DashboardContentLayout } from '@/Components/Dashboard/Layouts/DashboardContentLayout';
import { FooterDashboard } from '@/Components/Dashboard/Layouts/Footer/Index';
import { ToastContainer, toast } from 'react-toastify';
import { PageProps } from '@/types';

import 'react-toastify/dist/ReactToastify.css';

import '@/../css/dashboard/datatable.css';

interface PagePropsDashboard extends PageProps {
    error?: string;
    success?: string;
  }

interface DashboardLayoutProps {
    children: ReactNode;
}

export default function DashboardLayout({
    children,
  }: DashboardLayoutProps) {
    const { error, success } = usePage<PagePropsDashboard>().props;
    const [sidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        if (error) {
            console.log(error);
            toast.error(error);
        }
        if (success) {
            console.log(success);
            toast.success(success);
        }
      }, [error, success]);

    return (
      <>
        <SidebarDashboard sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main
          className={cn(
            "min-h-[calc(100vh_-_56px)] bg-zinc-50 dark:bg-zinc-900 transition-[margin-left] ease-in-out duration-300",
            sidebarOpen ? "lg:ml-72" : "lg:ml-[90px]"
          )}
        >
            <DashboardContentLayout>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                className="!z-[999999]"
            />
              {children}
            </DashboardContentLayout>
        </main>

        <footer
          className={cn(
            "transition-[margin-left] ease-in-out duration-300",
            sidebarOpen ? "lg:ml-72" : "lg:ml-[90px]"
          )}
        >
          <FooterDashboard />
        </footer>
      </>
    );
  }
