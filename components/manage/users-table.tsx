"use server";

import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ToggleAdminButton } from "./toogle-admin-button";
import { User } from "@/lib/types/users";

export async function UsersTable({ users }: { users: User[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Games Created</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow
            key={user.id}
            className="hover:bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-orange-500/10"
          >
            <TableCell className="font-medium">
              {`${user.firstName} ${user.lastName}`}
            </TableCell>
            <TableCell className="text-gray-600">{user.email}</TableCell>
            <TableCell>{user.gamesCreated}</TableCell>
            <TableCell>
              <div className="flex items-center space-x-2">
                <Link href={`/profile/${user.username}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="cursor-pointer"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View Profile
                  </Button>
                </Link>
                <ToggleAdminButton userId={user.id} isAdmin={user.isAdmin} />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
