"use client";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "./ui/button";

const navItems = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Companions",
    href: "/companions",
  },
  {
    label: "New",
    href: "/companions/new",
  },
  {
    label: "My Journey",
    href: "/my-journey",
  },
];

const NavItems = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <div className="flex items-center gap-4 max-sm:hidden">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "transition-colors hover:text-primary",
              pathname === item.href && "text-primary font-semibold"
            )}
          >
            {item.label}
          </Link>
        ))}
        <SignedOut>
          <SignInButton>
            <Button variant="outline" className="cursor-pointer">
              Login
            </Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
      <div className="sm:hidden">
        <button
          onClick={toggleMenu}
          className="text-gray-500 hover:text-gray-600 focus:outline-none"
        >
          <svg viewBox="0 0 100 80" width="40" height="40">
            <rect width="100" height="10"></rect>
            <rect y="30" width="100" height="10"></rect>
            <rect y="60" width="100" height="10"></rect>
          </svg>
        </button>
      </div>
      {isOpen && (
        <div className="absolute top-15 p-4 rounded-lg w-full right-0 bg-white z-10 sm:hidden flex items-center flex-col gap-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={toggleMenu}
              className={cn(
                "transition-colors hover:text-primary",
                pathname === item.href && "text-primary font-semibold"
              )}
            >
              {item.label}
            </Link>
          ))}
          <SignedOut>
            <SignInButton>
              <Button
                onClick={toggleMenu}
                variant="outline"
                className="cursor-pointer"
              >
                Login
              </Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      )}
    </div>
  );
};

export default NavItems;
