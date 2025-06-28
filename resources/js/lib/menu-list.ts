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
    LuMail,
    LuTrees,
    LuCalendar1,
} from "react-icons/lu";

import { usePage } from '@inertiajs/react';

type Submenu = {
    href: string;
    label: string;
    iconSubmenu: React.ElementType;
    active: boolean;
};

type Menu = {
    href?: string;
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
          {
              href: route('dashboard.kalender'),
              label: "Kalender",
              active: pathname.includes("/dashboard/kalender"),
              icon: LuCalendar1,
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
                // href: route('dashboard.admin.user.index'),
                label: "Pengguna",
                active: pathname.includes("/dashboard/admin/user") || pathname.includes("/dashboard/admin/pegawai") || pathname.includes("/dashboard/admin/mitra"),
                icon: LuUser,
                submenus: [
                  {
                    href : route('dashboard.admin.user.index'), 
                    label: "Akun Pengguna", 
                    iconSubmenu: LuUserPlus, 
                    active: pathname.includes("/dashboard/admin/user")},
                  {
                    href: route('dashboard.admin.pegawai.index'),
                    label: "Pegawai",
                    iconSubmenu: LuUserPlus,    
                    active: pathname.includes("/dashboard/admin/pegawai")},
                  {
                    href: route('dashboard.admin.mitra.index'),
                    label: "Mitra",
                    active: pathname.includes("/dashboard/admin/mitra"),
                    iconSubmenu: LuUserPlus},
                ]
            },
            {
                href: route('dashboard.admin.tim.index'),
                label: "Tim",
                active: pathname.includes("/dashboard/admin/tim"),
                icon: LuUsers,
                submenus: []
            },
            {
              href: route('dashboard.admin.wilayah.index'),
              active: pathname.includes("/dashboard/admin/wilayah"),
              label: "Wilayah",
              icon: LuMapPin,
              submenus: [
                {
                  href: route('dashboard.admin.wilayah.provinsi'),
                  label: 'Provinsi',
                  iconSubmenu: LuMapPin,
                  active: pathname.includes('/dashboard/admin/wilayah/provinsi'),
                },
                {
                  href: route('dashboard.admin.wilayah.kabkota'),
                  label: 'Kab/Kota',
                  iconSubmenu: LuMapPin,
                  active: pathname.includes('/dashboard/admin/wilayah/kab-kota'),
                },
                {
                  href: route('dashboard.admin.wilayah.kecamatan'),
                  label: 'Kecamatan',
                  iconSubmenu: LuMapPin,
                  active: pathname.includes('/dashboard/admin/wilayah/kecamatan'),
                },
                {
                  href: route('dashboard.admin.wilayah.keldesa'),
                  label: 'Kelurahan/Desa',
                  iconSubmenu: LuMapPin,
                  active: pathname.includes('/dashboard/admin/wilayah/kel-desa'),
                },
                {
                  href: route('dashboard.admin.wilayah.segmen'),
                  label: 'Segmen',
                  iconSubmenu: LuMapPin,
                  active: pathname.includes('/dashboard/admin/wilayah/segmen'),
                },
                {
                  href: route('dashboard.admin.wilayah.bloksensus'),
                  label: 'Blok Sensus',
                  iconSubmenu: LuMapPin,
                  active: pathname.includes('/dashboard/admin/wilayah/blok-sensus'),
                },
                {
                  href: route('dashboard.admin.wilayah.sls'),
                  label: 'SLS',
                  iconSubmenu: LuMapPin,
                  active: pathname.includes('/dashboard/admin/wilayah/sls'),
                },
              ]
            },
            {
              href: route('dashboard.admin.sampel.index'),
              label: "Sampel",
              active: pathname.includes("/dashboard/admin/sampel"),
              icon: LuClipboardList,
              submenus: []
            },
            {
              href: route('dashboard.admin.pengecekan.index'),
              label: "Pengecekan",
              active: pathname.includes("/dashboard/admin/pengecekan"),
              icon: LuClipboardCheck,
              submenus: []
            },
            {
              href: route('dashboard.admin.hasil-ubinan.index'),
              label: "Hasil Ubinan",
              active: pathname.includes("/dashboard/admin/hasil-ubinan"),
              icon: LuTrendingUp,
              submenus: []
            },
            {
              href: route('dashboard.admin.produktivitas.index'),
              label: "Produktivitas",
              active: pathname.includes("/dashboard/admin/produktivitas"),
              icon: LuTrees,
              submenus: []
            },
            {
              href: route('dashboard.admin.template-pesan.index'),
              label: "Template Pesan",
              active: pathname.includes("/dashboard/admin/template-pesan"),
              icon: LuMail,
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
            {
              href: route('dashboard.pml.hasil-ubinan.index'),
              label: "Hasil Ubinan",
              active: pathname.includes("/dashboard/pml/hasil-ubinan"),
              icon: LuTrendingUp,
              submenus: []
            },
          ]
        }
      ]: [])
    ];
  }
