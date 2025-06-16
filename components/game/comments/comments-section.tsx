"use server";
import { getComments } from "@/lib/actions/comments/get-comments";
import { getUser } from "@/lib/session";
import { DeleteComment } from "@/components/game/comments/delete-comment";
import { AddComment } from "@/components/game/comments/add-comment";
import { Error } from "@/components/error";
import Link from "next/link";
import { MessageSquare, Star } from "lucide-react";
import { CardTitle, Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export async function CommentsSection({ game }: { game: { id: string } }) {
  const result = await getComments(game.id);
  if (!result.success) {
    return <Error message={result.error} />;
  }
  const comments = result.comments;
  const user = await getUser();

  return (
    <Card className="p-6 my-8">
      <CardTitle className="flex text-3xl gap-2">
        <MessageSquare />
        Comments
      </CardTitle>
      <CardContent>
        {comments.length > 0 ? (
          <ul className="flex flex-col gap-4">
            {comments.map((comment) => (
              <li key={comment.id} className="p-4 border rounded-md">
                <div
                  className={cn("border-l-4 pl-2", {
                    "border-orange-500": (comment.authorRating ?? 0) >= 8,
                    "border-blue-500":
                      (comment.authorRating ?? 0) >= 5 &&
                      (comment.authorRating ?? 0) < 8,
                    "border-violet-500": (comment.authorRating ?? 0) < 5,
                  })}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">
                      {comment.authorFirstName + " " + comment.authorLastName}
                    </span>
                    {comment.authorRating !== null && (
                      <span className="text-xs text-gray-500">
                        <Star className="inline-block w-3 h-3 text-yellow-500" />
                        {comment.authorRating}/10
                      </span>
                    )}
                    <span className="text-xs text-gray-500">
                      {comment.createdAt.toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    {user &&
                      (user.username === comment.authorUsername ||
                        user.isAdmin) && (
                        <DeleteComment
                          commentId={comment.id}
                          gameId={game.id}
                        />
                      )}
                  </div>
                  <p className="mt-2 text-sm">{comment.content}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          "No comments yet"
        )}
        {user ? (
          <div className="mt-4">
            <AddComment gameId={game.id} />
          </div>
        ) : (
          <div className="mt-4">
            <p className="text-sm text-gray-500">
              Please{" "}
              <Link href={`/auth/login?from=/game/${game.id}`}>log in</Link> to
              add a comment.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
