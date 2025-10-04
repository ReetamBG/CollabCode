"use client";
import {
  Navbar,
  NavBody,
  NavItems,
  // MobileNav,
  NavbarLogo,
  // NavbarButton,
  // MobileNavHeader,
  // MobileNavToggle,
  // MobileNavMenu,
} from "@/components/ui/resizable-navbar";
// import { useState } from "react";
import { Button } from "./ui/button";
import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function RootNavbar() {
  const { isLoaded, user, isSignedIn } = useUser();

  const navItems = [
    {
      name: "Editor",
      link: "/editor",
    },
    {
      name: "Workspaces",
      link: "/workspaces",
    },
    // {
    //   name: "Contact",
    //   link: "#contact",
    // },
    {
      name: "Pricing",
      link: "#pricing",
    },
  ];

  // const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="fixed w-full z-10 top-2">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo imageUrl="logo.png" logoTitle="CollabCode" />
          <NavItems items={navItems} />
          <div className="flex items-center gap-4">
            {isLoaded && isSignedIn ? (
              <>
              <div className="p-0.5 rounded-full border-[1.5px] border-primary">
                <Avatar>
                  <AvatarImage src={user.imageUrl} />
                  <AvatarFallback>{user.firstName?.charAt(0)}{user.lastName?.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>
                <SignOutButton>
                  <Button variant="outline" className="rounded-full z-10 ml-2">Signout</Button>
                </SignOutButton>
              </>
            ) : (
              <SignInButton mode="modal">
                <Button
                  variant="default"
                  className="rounded-full z-10 hover:-translate-y-1 hover:scale-103 font-bold">
                  Signin
                </Button>
              </SignInButton>
            )}
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        {/* <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600 dark:text-neutral-300"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4">
              <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="primary"
                className="w-full"
              >
                Signin
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav> */}
      </Navbar>
    </div>
  );
}
