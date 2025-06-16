"use server";
import { getRatings } from "@/lib/actions/ratings/get-ratings";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Error } from "@/components/error";
import { RatingChart } from "./chart";
import { ModifyRating } from "./modify-rating";

export async function RatingCard({ gameId }: { gameId: string }) {
  const result = await getRatings(gameId);
  if (!result.success) {
    return <Error message={result.error} />;
  }

  return (
    <Card className="flex flex-col max-h-90 min-w-65">
      <CardContent className="flex-1 pb-0 mb-0">
        <RatingChart averageRating={result.averageRating} />
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="font-medium">
          {result.numberOfRatings > 0
            ? `Based on ${result.numberOfRatings} rating${
                result.numberOfRatings > 1 ? "s" : ""
              }`
            : "No ratings yet"}
        </div>
        <ModifyRating gameId={gameId} userRating={result.userRating} />
      </CardFooter>
    </Card>
  );
}
