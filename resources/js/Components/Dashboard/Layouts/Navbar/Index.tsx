import { ModeToggle } from "@/Components/Dashboard/Components/Navbar/ModeToggle";
import { UserNav } from "@/Components/Dashboard/Components/Navbar/UserNav";
import { SheetMenu } from "@/Components/Dashboard/Components/Navbar/SheetMenu";


export function NavbarDashboard() {
  return (
    // <header className="sticky top-0 z-10 w-full !bg-[url('/assets/img/bg-navbar.webp')] shadow backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary">
    <header className="sticky top-0 z-10 w-full')] shadow backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary">
      <div className="mx-4 sm:mx-8 flex h-14 items-center">
        <div className="flex items-center space-x-4 lg:space-x-0">
          <SheetMenu />
        </div>
        <div className="flex flex-1 items-center space-x-2 justify-end">
          {/* <ModeToggle /> */}
          <UserNav />
        </div>
      </div>
    </header>
  );
}
