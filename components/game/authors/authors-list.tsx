"use server";
import { cn } from "@/lib/utils";
import { getAuthors } from "@/lib/actions/authors/get-authors";
import { AddAuthor } from "@/components/game/authors/add-author";
import { RemoveAuthor } from "@/components/game/authors/remove-author";
import { Error } from "@/components/error";
import { getUser } from "@/lib/session";
import { QueryProvider } from "@/components/query-provider";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { EditAuthor } from "@/components/game/authors/edit-author";

export async function AuthorsList({
  game,
  edit = false,
}: {
  game: { id: string };
  edit?: boolean;
}) {
  const result = await getAuthors(game.id);
  if (!result.success) {
    return <Error message={result.error} />;
  }
  const authors = result.authors;
  const user = await getUser();

  return (
    <>
      <ul className="border rounded-md mb-2">
        {edit
          ? authors.map((author, index) => (
              <li
                className="p-4 flex justify-between items-center hover:bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-orange-500/10 rounded-md"
                key={author.id}
              >
                <h3 className="text-lg font-semibold">
                  {`${author.first_name} ${author.last_name}`}
                  {author.role ? ` - ${author.role}` : undefined}
                </h3>
                <div>
                  <EditAuthor gameId={game.id} authorId={author.id} />
                  {author.id != user.id && (
                    <RemoveAuthor gameId={game.id} userId={author.id} />
                  )}
                </div>
              </li>
            ))
          : authors.map((author, index) => (
              <Link key={author.id} href={`/profile/${author.username}`}>
                <li className="p-4 flex justify-between items-center hover:bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-orange-500/10 rounded-md">
                  <h3 className="text-lg font-semibold">
                    {`${author.first_name} ${author.last_name}`}
                    {author.role ? ` - ${author.role}` : undefined}
                  </h3>
                  <ChevronRight
                    className="h-4 w-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                </li>
              </Link>
            ))}
      </ul>
      {edit && (
        <QueryProvider>
          <AddAuthor
            gameId={game.id}
            authorIds={authors.map((author) => author.id)}
          />
        </QueryProvider>
      )}
    </>
  );
}
