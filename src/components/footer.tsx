import Link from "next/link";
import { Dumbbell } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Dumbbell className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">JERAI FITNESS</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Transform your body and mind. Premium facilities, expert trainers,
              and a community that pushes you forward.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                { href: "/classes", label: "Classes" },
                { href: "/pricing", label: "Pricing" },
                { href: "/about", label: "About Us" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Members */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Members
            </h3>
            <ul className="space-y-2">
              {[
                { href: "/login", label: "Member Login" },
                { href: "/signup", label: "Join Now" },
                { href: "/dashboard", label: "Dashboard" },
                { href: "/dashboard/book", label: "Book a Class" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Hours
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Mon - Fri: 5:00 AM - 10:00 PM</li>
              <li>Saturday: 7:00 AM - 8:00 PM</li>
              <li>Sunday: 8:00 AM - 6:00 PM</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border/40 pt-6 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} JERAI FITNESS. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
