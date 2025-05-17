"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CalendarIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  SettingsIcon,
  UserIcon,
  ClipboardListIcon,
} from "lucide-react";

interface MainNavProps {
  isLoggedIn?: boolean;
}

export function MainNav({ isLoggedIn = false }: MainNavProps) {
  const pathname = usePathname();

  const routes = [
    {
      href: "/dashboard",
      label: "Dashboard",
      active: pathname === "/dashboard",
      icon: <LayoutDashboardIcon className="mr-2 h-4 w-4" />,
      requiresAuth: true,
    },
    {
      href: "/services",
      label: "Services",
      active: pathname === "/services",
      icon: <ClipboardListIcon className="mr-2 h-4 w-4" />,
      requiresAuth: true,
    },
    {
      href: "/profile",
      label: "Profile",
      active: pathname === "/profile",
      icon: <UserIcon className="mr-2 h-4 w-4" />,
      requiresAuth: true,
    },
  ];

  return (
    <header className="border-b bg-card">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold mr-8">
            TempoBook
          </Link>
          {isLoggedIn && (
            <nav className="hidden md:flex items-center space-x-4">
              {routes
                .filter((route) => !route.requiresAuth || isLoggedIn)
                .map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-primary",
                      route.active
                        ? "text-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    {route.label}
                  </Link>
                ))}
            </nav>
          )}
        </div>

        <div className="flex items-center gap-4">
          <ThemeSwitcher />

          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=Anna"
                      alt="User"
                    />
                    <AvatarFallback>AK</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">Anna Kowalska</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      anna@salonania.com
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                {routes
                  .filter((route) => route.requiresAuth)
                  .map((route) => (
                    <DropdownMenuItem key={route.href} asChild>
                      <Link href={route.href} className="flex items-center">
                        {route.icon}
                        {route.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/auth" className="flex items-center">
                    <LogOutIcon className="mr-2 h-4 w-4" /> Log out
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/auth">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth?tab=signup">
                <Button size="sm">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
