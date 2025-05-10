"use server";
import { getUser } from "@/lib/session";
import { getGames } from "@/lib/actions/games/get-games";

import { Link } from "lucide-react";

export default async function MyGamesPage() {
  const user = await getUser();
  const games = await getGames(user.id);

  return (
    <ul>
      {games.map((game) => (
        <li key={game.id}>
          <Link href={`/game/${game.id}`} className="flex items-center gap-2">
            <div className="flex flex-col">
              <span className="text-sm font-medium">{game.name}</span>
              <Badge className="text-xs text-muted-foreground">
                {game.type}
              </Badge>
            </div>
            <div className="flex items-center gap-1">
              <Badge className="text-xs text-muted-foreground">
                {game.status}
              </Badge>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
