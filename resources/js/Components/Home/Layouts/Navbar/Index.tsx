import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { NavigationMenu, NavigationMenuList, NavigationMenuLink, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent, navigationMenuTriggerStyle } from '@/Components/ui/navigation-menu';
import { Sheet, SheetTrigger, SheetContent } from '@/Components/ui/sheet';
import { Button } from '@/Components/ui/button';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/Components/ui/collapsible';
import { FaChevronRight, FaBars, FaEdge, FaRightToBracket, FaArrowRight } from 'react-icons/fa6';
import { Loader2 } from 'lucide-react';
import { PageProps } from '@/types';

export const Navbar = ({ auth }: PageProps<{ auth: any }>) => {
  const [isPending, setIsPending] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!auth.user);

  const handleLoginClick = () => {
    setIsPending(true);

    // Simulate login process
    setTimeout(() => {
      setIsPending(false);
    }, 2000);
  };

  useEffect(() => {
    setIsLoggedIn(!!auth.user);
  }, [auth]);

  return (
    <>
      {/* <header className="sticky top-0 flex gap-3 px-6 h-20 w-full shrink-0 items-center md:px-8 bg-[url('/assets/img/bg-navbar.webp')] z-[99998] justify-between"> */}
      <header className="sticky top-0 flex gap-3 px-6 h-20 w-full shrink-0 items-center md:px-8')] z-[99998] justify-between">
        <div className="flex flex-row gap-3">
          <Link href="/" className="flex items-center">
            <div className="flex gap-2 items-center">
              <img src="/assets/img/logo.webp" alt="Ubinan Kediri BPS Kabupaten Kediri" className="w-16" />
              <div className='hidden sm:block'>
                <h1 className="text-xl font-bold text-black-bps">Ubinan Kediri</h1>
                <p className="text-sm font-medium text-black-bps">BPS Kabupaten Kediri</p>
              </div>
              <span className="sr-only">Navigasi ke Ubinan Kediri BPS Kabupaten Kediri</span>
            </div>
          </Link>
          <NavigationMenu className="hidden lg:flex">
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()} href="/menu-1">
                        Menu 1
                        </NavigationMenuLink>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()} href="/menu-2">
                        Menu 2
                        </NavigationMenuLink>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                        <NavigationMenuTrigger>Lihat Web Lainnya</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <div className="grid w-[550px] grid-cols-2 p-2">
                                <NavigationMenuLink asChild>
                                    <Link href="#" className="group grid h-auto w-full items-center gap-1 rounded-md bg-background p-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
                                    <div className="text-sm font-bold leading-none">Web 1</div>
                                    <div className="line-clamp-2 text-sm leading-snug text-muted-foreground">Deskripsi Web 1</div>
                                    </Link>
                                </NavigationMenuLink>
                                <NavigationMenuLink asChild>
                                    <Link href="#" className="group grid h-auto w-full items-center gap-1 rounded-md bg-background p-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
                                    <div className="text-sm font-bold leading-none">Web 2</div>
                                    <div className="line-clamp-2 text-sm leading-snug text-muted-foreground">Deskripsi Web 2</div>
                                    </Link>
                                </NavigationMenuLink>
                            </div>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
        </div>

        {/* Responsive Navbar Left */}
        <div className="flex gap-3">
          <Button onClick={handleLoginClick} className="flex gap-2 items-center" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="=h-4 w-4 animate-spin" />
                Harap tunggu...
              </>
            ) : isLoggedIn ? (
              <Link href={route('dashboard.beranda')} className="flex gap-2 items-center">
                <span>Dashboard</span>
                <FaArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <Link href={route('login')} className="flex gap-2 items-center">
                <span>Masuk</span>
                <FaRightToBracket className="h-4 w-4" />
              </Link>
            )}
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden">
                <FaBars className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu Ubinan Kediri BPS Kabupaten Kediri</span>
              </Button>
            </SheetTrigger>
            {/* <SheetContent side="left" className="z-[99999] bg-[url('/img/bg-sidebar.webp')] bg-right"> */}
            <SheetContent side="left" className="z-[99999]')] bg-right">
              <Link href="#">
                <FaEdge className="h-6 w-6" />
                <span className="sr-only">Ubinan Kediri BPS Kabupaten Kediri</span>
              </Link>
              <div className="grid gap-2 py-6">
                <Link href="/menu-1" className="flex w-full items-center py-2 text-lg font-semibold">
                    Menu 1
                </Link>
                <Link href="/menu-2" className="flex w-full items-center py-2 text-lg font-semibold">
                    Menu 2
                </Link>
                <Collapsible className="grid py-2 gap-4">
                  <CollapsibleTrigger className="flex w-full items-center text-lg font-semibold [&[data-state=open]>svg]:rotate-90">
                    Lihat Web Lainnya <FaChevronRight className="ml-auto h-4 w-4 transition-all" />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="-mx-6 grid gap-6 bg-muted p-6">
                      <Link href="#" className="group grid h-auto w-full justify-start gap-1">
                        <div className="text-sm leading-none font-bold">
                          Web 1
                        </div>
                        <div className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Deskripsi Web 1
                        </div>
                      </Link>
                      <Link href="#" className="group grid h-auto w-full justify-start gap-1">
                        <div className="text-sm leading-none font-bold">
                          Web 2
                        </div>
                        <div className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Deskripsi Web 2
                        </div>
                      </Link>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>
    </>
  );
};
