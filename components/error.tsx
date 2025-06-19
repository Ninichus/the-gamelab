"use client";

import { TriangleAlert } from "lucide-react";
import { Card, CardContent, CardHeader } from "./ui/card";

export function Error({ message }: { message: string }) {
  return (
    <Card className="bg-red-100 max-w-7xl mx-auto my-8 p-6 shadow-lg">
      <CardHeader className="flex items-center gap-2">
        <TriangleAlert />
        <h2 className="text-lg font-semibold">An error occurred</h2>
      </CardHeader>
      <CardContent>
        <p>{message}</p>
      </CardContent>
    </Card>
  );
}
