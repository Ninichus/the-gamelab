"use server";
import { getGames } from "@/lib/actions/get-games";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { getUserByUsername } from "@/lib/actions/get-user";
import { Error } from "@/components/error";

const legend = {
  board_game: "Board Game",
  cards_game: "Card Game",
  video_game: "Video Game",
};

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const username = (await params).username;
  const [author, { games }] = await Promise.all([
    getUserByUsername(username),
    getGames(username),
  ]);

  if (!author) {
    return <Error message="This user doesn't exist" />;
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">
        {author.first_name + " " + author.last_name}
      </h1>
      <ul>
        {games.map(({ game, role, tags }) => (
          <li key={game.id}>
            <Link
              href={`/game/${game.id}`}
              className="flex items-center gap-4 hover:bg-gray-100 p-2 rounded-md"
            >
              <span className="text-sm font-medium">{game.name}</span>
              <Badge className="text-xs">{legend[game.type]}</Badge>
              <Badge className="text-xs">{game.status}</Badge>
              {tags &&
                tags.map((tag) => (
                  <Badge key={tag.id} className="text-xs">
                    {tag.name}
                  </Badge>
                ))}
              {role && <Badge className="text-xs">{role}</Badge>}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
