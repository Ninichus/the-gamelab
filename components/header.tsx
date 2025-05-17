import Link from "next/link";
import { AvatarDropdown } from "./avatar-dropdown";
import { MainNav } from "./main-nav";
import { MobileNav } from "./mobile-nav";
import { GameLabIcon } from "./gamelab-icon";
import { getUser } from "@/lib/session";

export async function Header() {
  const user = await getUser();
  const isAdmin = user?.isAdmin;

  const navLinks = [
    { href: "/browse", title: "Browse" },
    { href: "/create", title: "Add a Game" },
  ];

  if (user) {
    navLinks.push({ href: `/profile/${user.username}`, title: "My Games" });
  }

  if (isAdmin) {
    navLinks.push({ href: "/manage", title: "Management" });
  }

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full backdrop-blur">
      <div className="flex md:hidden items-center px-4 h-14 justify-between">
        <MobileNav appName={"The GameLab"} navLinks={navLinks} />

        <Link href="/" className="flex mr-6 items-center">
          <GameLabIcon className="fill-foreground size-10" />
          <span className="font-bold">{"The Gamelab"}</span>
        </Link>

        <AvatarDropdown user={user} />
      </div>
      <div className="hidden md:flex container h-14 max-w-screen-2xl items-center">
        <MainNav appName={"The GameLab"} navLinks={navLinks} />
        <div className="flex flex-1 items-center justify-end space-x-2">
          <AvatarDropdown user={user} />
        </div>
      </div>
    </header>
  );
}
