import {
    LuUsers,
    LuUser,
    LuLayoutPanelLeft,
    LuLayoutDashboard,
    LuUserPlus,
    LuBriefcase,
    LuUngroup,
    LuMapPin,
    LuClipboardList,
    LuClipboardCheck,
    LuTrendingUp,
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

    // const userRole: string = auth.user.pegawai?.role ?? '';
    const userRole: string = auth.user.mitra
  ? 'MITRA'
  : auth.user.pegawai?.is_pml
    ? 'PML'
    : auth.user.pegawai?.role ?? '';

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
                icon: LuUser,
                submenus: []
            },
            {
                href: route('dashboard.admin.pegawai.index'),
                label: "Pegawai",
                active: pathname.includes("/dashboard/admin/pegawai"),
                icon: LuUserPlus,
                submenus: []
            },
            {
                href: route('dashboard.admin.mitra.index'),
                label: "Mitra",
                active: pathname.includes("/dashboard/admin/mitra"),
                icon: LuUserPlus,
                submenus: []
            },
            {
                href: route('dashboard.admin.tim.index'),
                label: "Tim",
                active: pathname.includes("/dashboard/admin/tim"),
                icon: LuUsers,
                submenus: []
            },
            {
              href: route('dashboard.admin.segmen-blok-sensus.index'),
              label: "Segmen & Blok Sensus",
              active: pathname.includes("/dashboard/admin/segmen-blok-sensus"),
              icon: LuMapPin,
              submenus: []
            },
            {
              href: route('dashboard.admin.sampel.index'),
              label: "Sampel",
              active: pathname.includes("/dashboard/admin/sampel"),
              icon: LuClipboardList,
              submenus: []
            },
            
          ]
        }
      ] : userRole === 'MITRA' ? [
        {
          groupLabel: "Mitra",
          menus: [
            {
              href: route('dashboard.mitra.sampel.index'),
              label: "Sampel",
              active: pathname.includes("/dashboard/mitra/sampel"),
              icon: LuClipboardList,
              submenus: []
            },
            {
              href: route('dashboard.mitra.pengecekan.index'),
              label: "Pengecekan",
              active: pathname.includes("/dashboard/mitra/pengecekan"),
              icon: LuClipboardCheck,
              submenus: []
            },
            {
              href: route('dashboard.mitra.hasil-ubinan.index'),
              label: "Hasil Ubinan",
              active: pathname.includes("/dashboard/mitra/hasil-ubinan"),
              icon: LuTrendingUp,
              submenus: []
            },
          ]
        }
      ] : userRole === 'PML' ? [
        {
          groupLabel: "PML",
          menus: [
            {
              href: route('dashboard.pml.sampel.index'),
              label: "Sampel",
              active: pathname.includes("/dashboard/pml/sampel"),
              icon: LuClipboardList,
              submenus: []
            },
            {
              href: route('dashboard.pml.pengecekan.index'),
              label: "Pengecekan",
              active: pathname.includes("/dashboard/pml/pengecekan"),
              icon: LuClipboardCheck,
              submenus: []
            },
          ]
        }
      ]: [])
    ];
  }
