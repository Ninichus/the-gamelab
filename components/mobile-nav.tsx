import Link from "next/link";

export async function MobileNav({
  navLinks,
}: {
  appName: string;
  navLinks: Array<{ href: string; title: string }>;
}) {
  return (
    <nav className="hidden md:flex items-center space-x-4">
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          {link.title}
        </Link>
      ))}
    </nav>
  );
}
