import {
  Home,
  Palette,
  BarChart3,
  Images,
  Settings,
  Users,
  FileText,
  HelpCircle,
} from "lucide-react";

export interface MenuItem {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  submenu?: MenuItem[];
  badge?: string;
  badgeColor?: "primary" | "success" | "warning" | "error";
}

export const mainNavItems: MenuItem[] = [
  {
    id: "dashboard",
    name: "Dashboard",
    icon: Home,
    href: "/home/dashboard",
  },
  {
    id: "designs",
    name: "Design Studio",
    icon: Palette,
    href: "/home/designs",
    submenu: [
      {
        id: "new-designs",
        name: "New Designs",
        icon: FileText,
        href: "/home/designs/new",
      },
      {
        id: "designs-list",
        name: "Designs List",
        icon: Images,
        href: "/home/designs/list",
      },
      {
        id: "recent-added",
        name: "Recent Added",
        icon: FileText,
        href: "/home/designs/recent",
      },
    ],
  },
  {
    id: "analytics",
    name: "Analytics",
    icon: BarChart3,
    href: "/home/analytics",
    submenu: [
      {
        id: "orders",
        name: "Order Analysis",
        icon: BarChart3,
        href: "/home/analytics/orders",
        badge: "New",
        badgeColor: "success",
      },
      {
        id: "reports",
        name: "Reports",
        icon: FileText,
        href: "/home/analytics/reports",
      },
      {
        id: "insights",
        name: "Insights",
        icon: Home,
        href: "/home/analytics/insights",
      },
    ],
  },
  {
    id: "collaboration",
    name: "Collaboration",
    icon: Users,
    href: "/home/collaboration",
    badge: "3",
    badgeColor: "warning",
  },
  {
    id: "assets",
    name: "Digital Assets",
    icon: Images,
    href: "/home/assets",
  },
];

export const secondaryNavItems: MenuItem[] = [
  { id: "settings", name: "Settings", icon: Settings, href: "/home/settings" },
  {
    id: "support",
    name: "Help & Support",
    icon: HelpCircle,
    href: "/home/support",
  },
];
