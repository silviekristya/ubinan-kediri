import {
    LuUsers,
    LuLayoutPanelLeft
} from "react-icons/lu";

import { usePage } from '@inertiajs/react';

type Submenu = {
    href: string;
    label: string;
    iconSubmenu: React.ElementType;
    active: boolean;
};

type Menu = {
    href: string;
    label: string;
    active: boolean;
    icon: React.ElementType;
    submenus: Submenu[];
};

type Group = {
    groupLabel: string;
    menus: Menu[];
};

  export function getMenuList(pathname: string): Group[] {
    const { auth } = usePage().props;

    const userRole: string = auth.user.pegawai?.role ?? '';
    return [
      {
        groupLabel: "",
        menus: [
          {
            href: route('dashboard.beranda'),
            label: "Dashboard",
            active: pathname === "/dashboard",
            icon: LuLayoutPanelLeft,
            submenus: []
          },
        //   {
        //     href: route('dashboard.menu1'),
        //     label: "Menu 1",
        //     active: pathname.startsWith("/dashboard/menu-1"),
        //     icon: LuLayoutPanelLeft,
        //     submenus: []
        //   }
        ]
      },
      ...(userRole === 'ADMIN' ? [
        {
          groupLabel: "Admin",
          menus: [
            {
                href: route('dashboard.admin.user.index'),
                label: "User",
                active: pathname.includes("/dashboard/admin/user"),
                icon: LuUsers,
                submenus: []
            },
            {
                href: route('dashboard.admin.pegawai.index'),
                label: "Pegawai",
                active: pathname.includes("/dashboard/admin/pegawai"),
                icon: LuUsers,
                submenus: []
            },
            {
                href: route('dashboard.admin.mitra.index'),
                label: "Mitra",
                active: pathname.includes("/dashboard/admin/mitra"),
                icon: LuUsers,
                submenus: []
            },
            {
                href: route('dashboard.admin.tim.index'),
                label: "Tim",
                active: pathname.includes("/dashboard/admin/tim"),
                icon: LuUsers,
                submenus: []
            },
          ]
        }
      ] : [])
    ];
  }
