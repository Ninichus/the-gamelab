import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import Link from "next/link";
import { CardHeader, CardContent, CardTitle } from "./ui/card";
import { Clock, EyeOff, Star } from "lucide-react";
import Image from "next/image";

//TODO : definge types in /lib
type Game = {
  id: string;
  name: string;
  type: "board_game" | "cards_game" | "video_game";
  status: string;
  tags?: {
    id: number;
    name: string;
  }[];
  averageRating: number | null;
  imagePreview?: string;
  role?: string;
};

const legend = {
  board_game: "Board Game",
  cards_game: "Card Game",
  video_game: "Video Game",
};

export function GameCard({ game }: { game: Game }) {
  return (
    <Link key={game.id} href={`/game/${game.id}`}>
      <Card className="p-0 h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group border-purple-100 hover:border-purple-300">
        <CardHeader className="p-0">
          <div className="aspect-video bg-gradient-to-br from-purple-100 via-blue-100 to-orange-100 rounded-t-lg flex items-center justify-center overflow-hidden border-none">
            {game.imagePreview && (
              <Image
                width={1920}
                height={1080}
                src={`/download/${game.imagePreview}`}
                alt={game.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 border-none scale-105"
              />
            )}
          </div>
        </CardHeader>
        <CardContent className="mt-0 pt-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex flex-wrap gap-1">
              <Badge
                variant="secondary"
                className="text-xs bg-purple-100 text-purple-700"
              >
                {legend[game.type]}
              </Badge>
              {game.role && (
                <Badge className="text-xs bg-orange-100 text-orange-700">
                  {game.role}
                </Badge>
              )}
              {game.status === "private" && (
                <Badge className="text-xs bg-green-100 text-green-700">
                  <EyeOff className="h-3 w-3 inline-block mr-1" />
                  Private
                </Badge>
              )}
              {game.status === "pending" && (
                <Badge className="text-xs bg-blue-100 text-blue-700">
                  <Clock className="h-3 w-3 inline-block mr-1" />
                  Pending Approval
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">
                {game.averageRating ?? "?"}
              </span>
            </div>
          </div>
          <CardTitle className="text-lg mb-2 group-hover:text-purple-600 transition-colors">
            {game.name}
          </CardTitle>

          <div className="flex flex-wrap gap-1 mb-3 overflow-hidden max-h-12">
            {game.tags?.map((tag) => (
              <Badge
                key={tag.id}
                variant="outline"
                className="text-xs border-purple-200 text-purple-600"
              >
                {tag.name}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
