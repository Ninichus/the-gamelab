"use server";
import { getGames } from "@/lib/actions/get-games";
import { getUserByUsername } from "@/lib/actions/get-user";
import { Error } from "@/components/error";
import { GamesList } from "@/components/browse/games-list";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

//TODO Loading wheel

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const username = (await params).username;
  const [author, games] = await Promise.all([
    getUserByUsername(username),
    getGames(username),
  ]);

  if (!author) {
    return <Error message="This user doesn't exist" />;
  }

  return (
    <>
      <Card className="max-w-7xl mx-auto my-6 p-4">
        <CardTitle className="font-bold text-3xl">{`${author.first_name} ${author.last_name}`}</CardTitle>
        <CardDescription className="flex p-0 m-0 gap-6">
          <span>{`${games.length} Game${
            games.length > 1 ? "s" : ""
          } Created`}</span>
          <span>
            {(() => {
              const ratedGames = games.filter((game) => game.averageRating);
              const avg =
                ratedGames.reduce(
                  (total, game) => total + game.averageRating!,
                  0
                ) / ratedGames.length;
              return isNaN(avg) ? "?" : avg.toFixed(1);
            })()}{" "}
            Average Rating
          </span>
        </CardDescription>
      </Card>

      <GamesList games={games} />
    </>
  );
}
