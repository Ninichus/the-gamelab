"use server";

import { GamesList } from "@/components/browse/games-list";
import { Gamepad, User } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { getPendingGames } from "@/lib/actions/manage/get-pending-games";
import { getUsers } from "@/lib/actions/manage/get-users";
import { UsersTable } from "@/components/manage/users-table";
import { Error } from "@/components/error";

//TODO use suspense and loading wheel
//TODO add approve button

export default async function BrowsePage() {
  const [users, pendingGames] = await Promise.all([
    getUsers(),
    getPendingGames(),
  ]);

  return (
    <div className="max-w-7xl mx-auto">
      <Card className="p-6 mt-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>All Users</span>
          </CardTitle>
          <CardDescription>
            View and manage user accounts and permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!users.success ? (
            <Error message={users.error} />
          ) : (
            <UsersTable users={users.users} />
          )}
        </CardContent>
      </Card>
      <Card className="p-6 mt-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Gamepad className="h-5 w-5" />
            <span>Pending Games</span>
          </CardTitle>
          <CardDescription>
            Review and approve games submitted by users
          </CardDescription>
        </CardHeader>
        <CardContent>
          For now, games do not require approval, but this feature could be
          added in the future.
          {!pendingGames.success ? (
            <Error message={pendingGames.error} />
          ) : (
            <GamesList games={pendingGames.games} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
