import Link from "next/link";
import { GameLabIcon } from "./gamelab-icon";

export async function MainNav({
  navLinks,
}: {
  appName: string;
  navLinks: Array<{ href: string; title: string }>;
}) {
  return (
    <>
      <Link href="/" className="hidden sm:flex mr-6 items-center">
        <GameLabIcon className="fill-foreground" />
      </Link>
      <nav className="hidden md:flex items-center space-x-4">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
            prefetch={link.title !== "Add a Game"}
          >
            {link.title}
          </Link>
        ))}
      </nav>
    </>
  );
}
