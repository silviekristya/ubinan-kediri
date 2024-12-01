import { FaEllipsis, FaRightFromBracket } from "react-icons/fa6";
import { cn } from "@/lib/utils";
import { Button } from "@/Components/ui/button";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { CollapseMenuButton } from "@/Components/Dashboard/Components/Dashboard/CollapseMenuButton";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/Components/ui/tooltip";
import { Link, usePage } from '@inertiajs/react';
import { getMenuList } from "@/lib/menu-list";

interface MenuProps {
  isOpen: boolean | undefined;
  userRole: string;
}

export function Menu({ isOpen, userRole }: MenuProps) {
  const pathname = window.location.pathname;
  const menuList = getMenuList(pathname, userRole);

  return (
    // <ScrollArea className="[&>div>div[style]]:!block">
      <nav className="mt-8 h-full w-full">
        <ul className="flex flex-col min-h-[calc(100vh-48px-36px-16px-32px)] lg:min-h-[calc(100vh-32px-40px-32px)] items-start space-y-1 px-2">
          {menuList.map(({ groupLabel, menus }, index) => (
            <li className={cn("w-full", groupLabel ? "pt-5" : "")} key={index}>
              {(isOpen && groupLabel) || isOpen === undefined ? (
                <p className="text-sm font-medium text-muted-foreground px-4 pb-2 max-w-[248px] truncate">
                  {groupLabel}
                </p>
              ) : !isOpen && isOpen !== undefined && groupLabel ? (
                <TooltipProvider>
                  <Tooltip delayDuration={50}>
                    <TooltipTrigger className="w-full">
                      <div className="w-full flex justify-center items-center">
                        <FaEllipsis className="h-5 w-5" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{groupLabel}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <p className="pb-2"></p>
              )}
              {menus.map(({ href, label, icon: Icon, active, submenus }, index) =>
                submenus.length === 0 ? (
                  <div className="w-full" key={index}>
                    <TooltipProvider disableHoverableContent>
                      <Tooltip delayDuration={50}>
                        <TooltipTrigger asChild>
                          <Button
                            variant={active ? "bpswhite" : "bpsblue"}
                            className="w-full justify-start h-10 mb-1"
                            asChild
                          >
                            <Link href={href}>
                              <div className={cn(isOpen === false ? "" : "mr-4")}>
                                <Icon size={18} />
                              </div>
                              <p
                                className={cn(
                                  "max-w-[200px] truncate",
                                  isOpen === false
                                    ? "-translate-x-96 opacity-0"
                                    : "translate-x-0 opacity-100"
                                )}
                              >
                                {label}
                              </p>
                            </Link>
                          </Button>
                        </TooltipTrigger>
                        {isOpen === false && (
                          <TooltipContent side="right">
                            {label}
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                ) : (
                  <div className="w-full" key={index}>
                    <CollapseMenuButton
                      icon={Icon}
                      label={label}
                      active={active}
                      submenus={submenus}
                      isOpen={isOpen}
                    />
                  </div>
                )
              )}
            </li>
          ))}
          <li className="w-full grow flex items-end">
            <TooltipProvider disableHoverableContent>
              <Tooltip delayDuration={50}>
                <TooltipTrigger asChild>
                    <Link href={route('logout')} method="post" as="button" className="cursor-pointer text-red-500 hover:!text-red-400 w-full justify-center h-10 mt-5">
                      <div className="flex">
                        <span className={cn(isOpen === false ? "" : "mr-4")}>
                          <FaRightFromBracket size={18} />
                        </span>
                        <p
                          className={cn(
                            "whitespace-nowrap",
                            isOpen === false ? "opacity-0 hidden" : "opacity-100"
                          )}
                        >
                          Keluar
                        </p>
                      </div>
                    </Link>
                </TooltipTrigger>
                {isOpen === false && (
                  <TooltipContent side="right">Keluar</TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </li>
        </ul>
      </nav>
    // </ScrollArea>
  );
}
