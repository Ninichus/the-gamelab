import { Menu } from "lucide-react";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";
import { GameLabIcon } from "./gamelab-icon";

export async function MobileNav({
  navLinks,
}: {
  appName: string;
  navLinks: Array<{ href: string; title: string }>;
}) {
  return (
    <Sheet>
      <SheetTrigger>
        <Menu />
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>
            <Link href="/" className="flex mr-6 items-center gap-2">
              <GameLabIcon className="fill-foreground size-12" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">The GameLab</h1>
              </div>
            </Link>
          </SheetTitle>
          <SheetDescription className="flex flex-col space-y-4 ml-5 mt-5">
            {navLinks.map((link) => (
              <SheetClose asChild>
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-lg font-medium text-muted-foreground hover:text-foreground"
                  prefetch={link.href !== "/create" && link.href !== "/manage"}
                >
                  {link.title}
                </Link>
              </SheetClose>
            ))}
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
