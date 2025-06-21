export type User = {
  id: number;
  username: string;
  email: string;
  isAdmin: boolean;
  gamesCreated: number;
  firstName: string;
  lastName: string;
};

export type Author = {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  role: string | null;
};
