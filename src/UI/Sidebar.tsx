import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { User, LogOut, Bell, ChevronRight } from "lucide-react";
import {
  mainNavItems,
  secondaryNavItems,
  MenuItem,
} from "../Constants/navItems";

// Function to decode JWT token and extract user data
const decodeToken = (
  token: string | null,
): { email: string; permissions: string[] } => {
  if (!token) return { email: "User", permissions: [] };
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64));
    return {
      email: payload.email || payload.user?.email || "User",
      permissions: payload.permissions || [],
    };
  } catch (error) {
    console.error("Error decoding token:", error);
    return { email: "User", permissions: [] };
  }
};

// Function to check if user has permission for a menu item
const hasPermission = (itemName: string, permissions: string[]): boolean => {
  return permissions.includes(itemName);
};

// Function to filter menu items based on permissions
const filterMenuByPermissions = (
  menuItems: MenuItem[],
  permissions: string[],
): MenuItem[] => {
  return menuItems
    .filter((item) => hasPermission(item.name, permissions))
    .map((item) => {
      if (item.submenu && item.submenu.length > 0) {
        const filteredSubmenu = item.submenu.filter((subItem) =>
          hasPermission(`${item.name} - ${subItem.name}`, permissions),
        );
        return {
          ...item,
          submenu: filteredSubmenu.length > 0 ? filteredSubmenu : undefined,
        };
      }
      return item;
    });
};

const Sidebar = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [userEmail, setUserEmail] = useState<string>("User");
  const [filteredMainNav, setFilteredMainNav] = useState<MenuItem[]>([]);
  const [filteredSecondaryNav, setFilteredSecondaryNav] = useState<MenuItem[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if mobile view and load user permissions
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    const token = localStorage.getItem("token");
    const { email } = decodeToken(token);

    const permissionsStr = localStorage.getItem("permissions");
    let permissions: string[] = [];

    try {
      permissions = permissionsStr ? JSON.parse(permissionsStr) : [];
    } catch (error) {
      console.error("Error parsing permissions:", error);
      permissions = [];
    }

    setUserEmail(email);

    const filteredMain = filterMenuByPermissions(mainNavItems, permissions);
    const filteredSecondary = filterMenuByPermissions(
      secondaryNavItems,
      permissions,
    );
    setFilteredMainNav(filteredMain);
    setFilteredSecondaryNav(filteredSecondary);

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Auto-expand parent menu items when child is active
  useEffect(() => {
    const findParentForPath = (
      items: MenuItem[],
      currentPath: string,
    ): string | null => {
      for (const item of items) {
        if (item.submenu) {
          const childMatch = item.submenu.find(
            (subItem) => subItem.href === currentPath, // Use currentPath instead of location.pathname
          );
          if (childMatch) {
            return item.id;
          }
        }
      }
      return null;
    };

    const parentId = findParentForPath(
      [...mainNavItems, ...secondaryNavItems],
      location.pathname,
    );
    if (parentId) {
      setExpandedItems((prev) => new Set(prev).add(parentId));
    }
  }, [location.pathname]);

  const toggleSubmenu = (itemId: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const getBadgeColor = (color?: string) => {
    switch (color) {
      case "success":
        return "bg-[var(--color-primary-light)] text-white";
      case "warning":
        return "bg-yellow-500 text-gray-900";
      case "error":
        return "bg-red-500 text-white";
      default:
        return "bg-[var(--color-primary)] text-white";
    }
  };

  const isItemActive = (item: MenuItem): boolean => {
    if (item.href === location.pathname) return true;
    if (item.submenu) {
      return item.submenu.some((subItem) => subItem.href === location.pathname);
    }
    return false;
  };

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const hasSubmenu = item.submenu && item.submenu.length > 0;
    const isExpanded = expandedItems.has(item.id);
    const isActive = isItemActive(item);

    return (
      <li key={item.id}>
        {hasSubmenu ? (
          <div
            className={`group flex cursor-pointer items-center justify-between rounded-lg px-4 py-3 transition-all duration-200 ${
              isActive
                ? "scale-[1.02] transform bg-[var(--color-primary)] text-white shadow-lg"
                : "text-gray-300 hover:bg-[var(--color-primary-dark)] hover:text-white"
            } ${level > 0 && !isMobile ? "ml-4" : ""} ${isMobile ? "justify-center" : "justify-between"}`}
            onClick={() => toggleSubmenu(item.id)}
          >
            <div
              className={`flex items-center ${isMobile ? "justify-center" : "min-w-0 flex-1"}`}
            >
              <item.icon
                className={`h-5 w-5 flex-shrink-0 ${isActive ? "text-white" : "text-gray-400"} ${isMobile ? "" : "mr-3"}`}
              />
              <span
                className={`truncate text-sm font-medium ${isMobile ? "hidden" : "block"}`}
              >
                {item.name}
              </span>
            </div>

            <div
              className={`ml-2 flex items-center space-x-2 ${isMobile ? "hidden" : "block"}`}
            >
              {item.badge && (
                <span
                  className={`inline-flex items-center justify-center rounded-full px-2 py-1 text-xs font-bold ${getBadgeColor(item.badgeColor)}`}
                >
                  {item.badge}
                </span>
              )}
              {hasSubmenu && (
                <ChevronRight
                  className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}
                />
              )}
            </div>
          </div>
        ) : (
          <Link
            to={item.href}
            className={`group flex items-center justify-between rounded-lg px-4 py-3 transition-all duration-200 ${
              isActive
                ? "scale-[1.02] transform bg-[var(--color-primary)] text-white shadow-lg"
                : "text-gray-300 hover:bg-[var(--color-primary-dark)] hover:text-white"
            } ${level > 0 && !isMobile ? "ml-4" : ""} ${isMobile ? "justify-center" : "justify-between"}`}
          >
            <div
              className={`flex items-center ${isMobile ? "justify-center" : "min-w-0 flex-1"}`}
            >
              <item.icon
                className={`h-5 w-5 flex-shrink-0 ${isActive ? "text-white" : "text-gray-400"} ${isMobile ? "" : "mr-3"}`}
              />
              <span
                className={`truncate text-sm font-medium ${isMobile ? "hidden" : "block"}`}
              >
                {item.name}
              </span>
            </div>

            <div
              className={`ml-2 flex items-center space-x-2 ${isMobile ? "hidden" : "block"}`}
            >
              {item.badge && (
                <span
                  className={`inline-flex items-center justify-center rounded-full px-2 py-1 text-xs font-bold ${getBadgeColor(item.badgeColor)}`}
                >
                  {item.badge}
                </span>
              )}
            </div>
          </Link>
        )}

        {hasSubmenu && isExpanded && (
          <ul className="animate-fadeIn mt-1 space-y-1">
            {item.submenu!.map((subItem) => renderMenuItem(subItem, level + 1))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <>
      <div
        className={`fixed inset-y-0 left-0 z-40 ${isMobile ? "w-16" : "w-80"} flex flex-col border-r border-[var(--color-primary-dark)] bg-gradient-to-b from-[var(--color-primary-dark)] to-[var(--color-primary)] shadow-2xl transition-all duration-300 min-h-screen`}
      >
        <div className="border-b border-[var(--color-primary-dark)] p-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-[var(--color-primary-light)] to-[var(--color-primary)] shadow-lg">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="absolute -right-1 -bottom-1 h-3 w-3 rounded-full border-2 border-[var(--color-primary-dark)] bg-[var(--color-primary-light)]"></div>
            </div>
            <div className={`min-w-0 flex-1 ${isMobile ? "hidden" : "block"}`}>
              <p className="truncate text-sm font-semibold text-white">
                {userEmail}
              </p>
              <p className="truncate text-xs text-gray-400">
                Admin • Enterprise
              </p>
            </div>
            <div className={`${isMobile ? "hidden" : "block"}`}>
              <Bell className="h-5 w-5 cursor-pointer text-gray-400 transition-colors hover:text-white" />
            </div>
          </div>
        </div>

        <nav className="custom-scrollbar flex-1 overflow-y-auto py-6 min-h-0">
          <ul className="space-y-2 px-4">
            {filteredMainNav.map((item) => renderMenuItem(item))}
          </ul>

          {filteredSecondaryNav.length > 0 && (
            <div className="mt-8 px-4">
              <div
                className={`mb-3 text-xs font-semibold tracking-wider text-gray-500 uppercase ${isMobile ? "hidden" : "block"}`}
              >
                Workspace
              </div>
              <ul className="space-y-2">
                {filteredSecondaryNav.map((item) => renderMenuItem(item))}
              </ul>
            </div>
          )}
        </nav>

        <div className="flex-shrink-0 border-t border-[var(--color-primary-dark)] p-4">
          <div className="flex items-center justify-between">
            <button
              className={`group flex items-center space-x-3 text-gray-400 transition-colors duration-200 hover:text-white ${isMobile ? "justify-center" : ""}`}
              onClick={handleLogout}
            >
              <div className="rounded-lg bg-[var(--color-primary-dark)] p-2 transition-colors group-hover:bg-[var(--color-primary)]">
                <LogOut className="h-4 w-4" />
              </div>
              <span
                className={`text-sm font-medium ${isMobile ? "hidden" : "block"}`}
              >
                Logout
              </span>
            </button>
          </div>

          <div className={`mt-2 text-center ${isMobile ? "hidden" : "block"}`}>
            <div className="text-xs text-gray-500">© 2025 Thugil Creation</div>
            <div className="mt-1 text-[10px] text-gray-600">
              v2.2 • Enterprise
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--color-primary-dark);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: var(--color-primary);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .custom-scrollbar {
          -webkit-overflow-scrolling: touch;
        }
        div[style*="fixed"] {
          contain: strict;
        }
      `}</style>
    </>
  );
};

export default Sidebar;