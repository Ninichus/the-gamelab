"use server";
import Link from "next/link";

export async function Footer() {
  return (
    <footer className="bg-muted text-muted-foreground p-4 text-center">
      <p className="text-sm">
        &copy; {new Date().getFullYear()} - The Gamelab - All rights reserved
      </p>
      <p className="text-sm">
        Made by{" "}
        <Link
          href="mailto:arthur.conrozier@student-cs.fr?subject=The Gamelab's website"
          className="underline"
          target="_blank"
        >
          Arthur Conrozier
        </Link>
      </p>
    </footer>
  );
}
