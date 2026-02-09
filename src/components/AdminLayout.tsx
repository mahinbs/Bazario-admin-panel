import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { Button } from "@/components/ui/button";
import { Bell, User, LogOut, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMobile } from "@/hooks/useMobile";

export function AdminLayout() {
  const { isNative, hapticFeedback } = useMobile();

  const handleMenuClick = async () => {
    await hapticFeedback();
  };

  const handleNotificationClick = async () => {
    await hapticFeedback();
  };

  const handleProfileClick = async () => {
    await hapticFeedback();
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />

        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className={`border-b border-border bg-card flex items-center justify-between px-4 ${isNative ? 'pt-12' : 'px-6'} shadow-soft`}>
            <div className="flex items-center gap-4">
              <SidebarTrigger
                className="hover:bg-secondary/50 transition-colors p-2 rounded-lg"
                onClick={handleMenuClick}
              >
                <Menu className="w-5 h-5" />
              </SidebarTrigger>
              <div className="hidden md:block">
                <h1 className="text-xl font-semibold text-foreground">Bazario Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">Manage your Bazario ecommerce platform</p>
              </div>
              <div className="md:hidden">
                <h1 className="text-lg font-semibold text-foreground">Admin</h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="relative p-2 rounded-lg"
                onClick={handleNotificationClick}
              >
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-admin-error rounded-full text-xs"></span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full"
                    onClick={handleProfileClick}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="/bazario-logo-1.png" alt="Admin" />
                      <AvatarFallback className="bg-brand-gradient text-primary-foreground">BZ</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">Admin User</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        admin@bazario.com
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Main Content */}
          <main className={`flex-1 p-4 md:p-6 bg-gradient-to-br from-orange-50 via-pink-50 to-white overflow-auto ${isNative ? 'pb-20' : ''}`}>
            <Outlet />
          </main>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </SidebarProvider>
  );
}