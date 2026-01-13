export type Game = {
  id: string;
  name: string;
  type: GameType;
  status: GameStatus;
  createdAt: Date;
  tags?: {
    id: number;
    name: string;
  }[];
  averageRating: number | null;
  imagePreview?: string;
  role?: string;
};

export type GameType = "board_game" | "cards_game" | "video_game";
export type GameStatus = "published" | "pending" | "private";
