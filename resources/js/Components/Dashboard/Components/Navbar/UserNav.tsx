import { Link, usePage } from '@inertiajs/react';
import { Button } from "@/Components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "@/Components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/Components/ui/dropdown-menu";
import { FaUser, FaRightFromBracket, FaUserGear } from "react-icons/fa6";

export function UserNav() {
    const { auth } = usePage().props;
    const user = auth?.user;
    let userName = auth?.user?.pegawai?.nama ?? auth?.user?.mitra?.nama ?? '';
    return (
        <DropdownMenu>
            <TooltipProvider disableHoverableContent>
                <Tooltip delayDuration={50}>
                <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            className="relative h-8 w-8 rounded-full"
                        >
                        <Avatar className="h-8 w-8">
                            <AvatarImage src="#" alt={userName} />
                            <AvatarFallback className="bg-transparent text-xs">
                                <FaUser className="h-4 w-4" />
                            </AvatarFallback>
                        </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent side="bottom">Profil</TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                        {userName}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                        ({user?.username}) {user?.email}
                    </p>
                </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                    <DropdownMenuItem  className="cursor-pointer gap-2 text-black-bps hover:!text-blue-bps-medium dark:text-white-bps-dark dark:hover:text-blue-bps-light" asChild>
                        <Link href={route('dashboard.profil.index')}>
                            <FaUserGear />
                            Profil
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuItem className="w-full cursor-pointer gap-2 text-red-500 hover:!text-red-400" asChild>
                    <Link href={route('logout')} method="post" as="button">
                        <FaRightFromBracket />
                        Keluar
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
