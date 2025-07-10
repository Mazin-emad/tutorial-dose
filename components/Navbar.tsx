import Image from "next/image";
import NavItems from "./NavItems";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link href="/">
        <div className="flex items-center gap-2.5 cursor-pointer">
          <Image src="/images/logo.svg" alt="logo" width={46} height={44} />
        </div>
      </Link>
      <div className="flex items-center sm:gap-8 gap-4">
        <NavItems />
        <Link href="/login">Login</Link>
      </div>
    </nav>
  );
};

export default Navbar;
