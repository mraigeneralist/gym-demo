"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { Profile } from "@/lib/types/database";
import {
  Dumbbell,
  LayoutDashboard,
  Users,
  Calendar,
  ClipboardList,
  Flame,
  LogOut,
  Menu,
  User,
  Shield,
} from "lucide-react";
import { useState } from "react";

const sidebarLinks = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/members", label: "Members", icon: Users },
  { href: "/admin/classes", label: "Classes", icon: Calendar },
  { href: "/admin/bookings", label: "Bookings", icon: ClipboardList },
  { href: "/admin/wod", label: "Workout of Day", icon: Flame },
];

interface SidebarProps {
  profile: Profile | null;
  userEmail: string;
}

function SidebarContent({
  profile,
  userEmail,
  onNavigate,
}: SidebarProps & { onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-2 border-b border-border/40 px-4">
        <Dumbbell className="h-6 w-6 text-primary" />
        <span className="text-lg font-bold">JERAI</span>
        <Shield className="ml-auto h-4 w-4 text-primary" />
      </div>

      <nav className="flex-1 space-y-1 px-2 py-4">
        {sidebarLinks.map((link) => {
          const isActive =
            pathname === link.href ||
            (link.href !== "/admin" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border/40 p-4">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
            <User className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">
              {profile?.full_name || "Admin"}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {userEmail}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" asChild className="flex-1">
            <Link href="/dashboard">Member View</Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function AdminSidebar({ profile, userEmail }: SidebarProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="fixed top-0 left-0 z-50 flex h-16 w-full items-center border-b border-border/40 bg-background/80 px-4 backdrop-blur-lg md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SidebarContent
              profile={profile}
              userEmail={userEmail}
              onNavigate={() => setOpen(false)}
            />
          </SheetContent>
        </Sheet>
        <div className="ml-3 flex items-center gap-2">
          <Dumbbell className="h-5 w-5 text-primary" />
          <span className="font-bold">JERAI Admin</span>
        </div>
      </div>

      <aside className="hidden w-64 shrink-0 border-r border-border/40 bg-sidebar md:block">
        <SidebarContent profile={profile} userEmail={userEmail} />
      </aside>

      <div className="h-16 md:hidden" />
    </>
  );
}
