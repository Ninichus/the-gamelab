"use client";

import { Form } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormControl,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { addComment } from "@/lib/actions/comments/add-comment";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  comment: z
    .string()
    .trim()
    .min(1, "Comment cannot be empty")
    .max(500, "Comment cannot exceed 500 characters"),
});

//TODO : loading state on button

export function AddComment({ gameId }: { gameId: string }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (payload) => {
          await addComment({ gameId, comment: payload.comment });
          //TODO handle success or error here, e.g., show a toast notification
          form.reset({ comment: "" });
        })}
      >
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormControl {...field}>
                <Textarea placeholder="Type a comment" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <p className="text-xs text-gray-500 py-2">
          Your name and the rating you gave this game will appear alongside your
          comment
        </p>
        <Button type="submit" className="cursor-pointer">
          Post Comment
        </Button>
      </form>
    </Form>
  );
}
