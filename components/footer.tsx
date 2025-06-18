"use server";
import Link from "next/link";

export async function Footer() {
  return (
    <footer className="bg-muted text-muted-foreground p-4 text-center">
      <p className="text-sm">
        &copy; {new Date().getFullYear()} - The Gamelab - All rights reserved
        -&nbsp;
        <Link
          href="mailto:ali-deniz.ozkan@centralesupelec.fr?subject=Gamelab"
          className="underline"
          target="_blank"
        >
          Contact
        </Link>
      </p>
      <p className="text-sm">
        Made by&nbsp;
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
