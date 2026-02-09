import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  Store,
  Bike,
  Truck,
  BarChart3,
  Settings,
  Bell,
  Search,
  LogOut,
  X,
  Menu,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useMobile } from "@/hooks/useMobile";
import { useState } from "react";

const mainNavItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Users", url: "/users", icon: Users },
  { title: "Products", url: "/products", icon: Package },
  { title: "Orders", url: "/orders", icon: ShoppingCart },
  { title: "Stores", url: "/stores", icon: Store },
  { title: "Riders", url: "/riders", icon: Bike },
  { title: "Delivery", url: "/delivery", icon: Truck },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
];

const settingsItems = [
  { title: "Settings", url: "/settings", icon: Settings },
];

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { logout, admin } = useAuth();
  const { hapticFeedback } = useMobile();
  const currentPath = location.pathname;

  const handleLogout = async () => {
    try {
      await hapticFeedback();
      await logout();
      navigate("/login");
      onClose();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isActive = (path: string) => {
    if (path === "/") return currentPath === "/";
    return currentPath.startsWith(path);
  };

  const handleNavClick = async (url: string) => {
    await hapticFeedback();
    onClose();
  };

  const getNavClass = (path: string) => {
    const baseClass = "w-full justify-start p-4 rounded-lg transition-all duration-200 text-left";
    return isActive(path)
      ? `${baseClass} bg-brand-gradient text-primary-foreground shadow-soft`
      : `${baseClass} text-muted-foreground hover:text-foreground hover:bg-secondary/50`;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-80 bg-card border-r border-border z-50 lg:hidden transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center overflow-hidden rounded-lg">
                  <img src="/bazario-logo-1.png" alt="Bazario" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Bazario</h2>
                  <p className="text-xs text-muted-foreground">Admin Suite</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="p-2"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="pl-10 bg-background border-input"
              />
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Main Menu */}
            <div>
              <h3 className="text-xs uppercase tracking-wider text-muted-foreground px-2 mb-3">
                Main Menu
              </h3>
              <div className="space-y-2">
                {mainNavItems.map((item) => (
                  <NavLink
                    key={item.title}
                    to={item.url}
                    className={getNavClass(item.url)}
                    onClick={() => handleNavClick(item.url)}
                  >
                    <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                    <span className="font-medium">{item.title}</span>
                  </NavLink>
                ))}
              </div>
            </div>

            {/* System */}
            <div>
              <h3 className="text-xs uppercase tracking-wider text-muted-foreground px-2 mb-3">
                System
              </h3>
              <div className="space-y-2">
                {settingsItems.map((item) => (
                  <NavLink
                    key={item.title}
                    to={item.url}
                    className={getNavClass(item.url)}
                    onClick={() => handleNavClick(item.url)}
                  >
                    <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                    <span className="font-medium">{item.title}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border bg-gradient-subtle space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2 bg-background/50 hover:bg-background"
            >
              <Bell className="w-4 h-4" />
              Notifications
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="w-full justify-start gap-2 bg-background/50 hover:bg-background text-destructive hover:text-destructive border-destructive/20 hover:border-destructive/40"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export function MobileMenuButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className="lg:hidden p-2"
    >
      <Menu className="w-5 h-5" />
    </Button>
  );
}
