export type Comment = {
  id: number;
  content: string;
  authorFirstName: string;
  authorLastName: string;
  authorUsername: string;
  authorRating: number | null;
  createdAt: Date;
};
