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
      <Link href="/" className="flex mr-6 items-center gap-2">
        <GameLabIcon className="fill-foreground size-12" />
        <div>
          <h1 className="text-xl font-bold text-gray-900">The GameLab</h1>
        </div>
      </Link>
      <nav className="flex items-center space-x-4">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="relative text-sm font-medium text-muted-foreground hover:text-foreground after:content-[''] after:absolute after:left-0 after:-bottom-0.5 after:h-[2px] after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full"
            prefetch={link.href !== "/create" && link.href !== "/manage"}
          >
            {link.title}
          </Link>
        ))}
      </nav>
    </>
  );
}
