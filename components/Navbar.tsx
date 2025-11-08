import { SignedOut, SignInButton, SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

const Navbar = () => {
  return (
    <header className="flex justify-between items-center p-4 gap-4 h-16 max-w-7xl mx-auto border-b bg-background">
      <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
        <Image
          src="/namoolnowlogo.png"
          alt="NamoolNow"
          width={40}
          height={40}
          className="h-8 w-8"
        />
        <span>NamoolNow</span>
      </Link>
      <div className="flex gap-4 items-center">
        <ThemeToggle />
        <SignedOut>
          <SignInButton mode="modal">
            <Button>로그인</Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </header>
  );
};

export default Navbar;
