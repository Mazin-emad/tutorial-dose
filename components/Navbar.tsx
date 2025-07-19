import Image from "next/image";
import NavItems from "./NavItems";
import Link from "next/link";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "./ui/button";

const Navbar = () => {
  return (
    <nav className="navbar max-sm:justify-center">
      <Link href="/" className="max-sm:hidden">
        <div className="flex items-center gap-2.5 cursor-pointer">
          <Image src="/images/logo.svg" alt="logo" width={46} height={44} />
        </div>
      </Link>
      <div className="flex items-center sm:gap-8 gap-4 max-md:justify-end">
        <NavItems />
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
    </nav>
  );
};

export default Navbar;
