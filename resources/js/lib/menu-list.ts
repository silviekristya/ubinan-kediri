import {
    LuUsers,
    LuLayoutPanelLeft
  } from "react-icons/lu";


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

  export function getMenuList(pathname: string, userRole: string | undefined): Group[] {
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
            href: route('dashboard.beranda'),
            label: "Dashboard",
            active: pathname.startsWith("/dashboard"),
            icon: LuLayoutPanelLeft,
            submenus: []
          }
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
          ]
        }
      ] : [])
    ];
  }
