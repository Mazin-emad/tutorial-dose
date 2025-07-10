"use client";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";

const navItems = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "companions",
    href: "/companions",
  },
  {
    label: "My Journey",
    href: "/my-journey",
  },
];

const NavItems = () => {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-2 sm:gap-4">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "transition-colors hover:text-primary",
            (pathname === item.href ||
              (pathname.includes(item.href) && item.href !== "/")) &&
              "text-primary font-semibold"
          )}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
};

export default NavItems;
