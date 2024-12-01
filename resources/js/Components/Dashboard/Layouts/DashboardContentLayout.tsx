import { NavbarDashboard } from "@/Components/Dashboard/Layouts/Navbar/Index";
import BreadcrumbDashboard from '@/Components/Dashboard/Components/Breadcrumb/Index';

interface DashboardContentLayoutProps {
  children: React.ReactNode;
}

export function DashboardContentLayout({ children }: DashboardContentLayoutProps) {
  return (
    <div>
      <NavbarDashboard />
      {/* <div className="w-full mx-auto pt-8 pb-8 px-4 sm:px-8 bg-[url('/assets/img/bg-dashboard.webp')] min-h-[calc(100vh-244px)]"> */}
      <div className="w-full mx-auto pt-8 pb-8 px-4 sm:px-8')] min-h-[calc(100vh-244px)]">
        <BreadcrumbDashboard />
        <div className="min-h-[calc(100vh-244px)]">
          {children}
        </div>
      </div>
    </div>
  );
}
