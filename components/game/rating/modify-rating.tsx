"use client";
import { CommentRatings } from "@/components/ui/rating";
import Link from "next/link";
import { modifyRating } from "@/lib/actions/ratings/rate";

export function ModifyRating({
  gameId,
  userRating,
}: {
  gameId: string;
  userRating?: number | null;
}) {
  return userRating !== undefined ? (
    <div>
      <CommentRatings
        rating={userRating || 0}
        totalStars={10}
        onRatingChange={async (currentRating: number) => {
          await modifyRating({ gameId, rating: currentRating });
        }}
      />
      <p className="text-sm text-gray-500">
        {userRating === null
          ? "You have not rated this game yet"
          : `You rated
        this game ${userRating} out of 10`}
      </p>
    </div>
  ) : (
    <p className="text-sm text-gray-500">
      You must <Link href={`/auth/login?from=/game/${gameId}`}>log in</Link> to
      rate this game
    </p>
  );
}
