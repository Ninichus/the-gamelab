"use client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronsUpDown, Check } from "lucide-react";
import { addAuthor } from "@/lib/actions/authors/add-author";
import { searchUsers } from "@/lib/actions/search-users";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export function AddAuthor({
  gameId,
  authorIds,
}: {
  gameId: string;
  authorIds: number[];
}) {
  const [open, setOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [value, setValue] = useState(""); //Selected user's id
  const [roleValue, setRoleValue] = useState(""); //Role of the selected user
  const [search, setSearch] = useState("");
  const { data: users, isLoading } = useQuery({
    queryKey: ["users", search, gameId],
    queryFn: async () => {
      if (!search) return [];
      const allUsers = await searchUsers({
        query: search,
        limit: 25,
        offset: 0,
      });
      // Filter out users who are already authors
      const existingAuthorsIds = new Set(authorIds);
      return allUsers.filter((user) => !existingAuthorsIds.has(user.id));
    },
    enabled: search.length >= 2,
  });

  const selectedUser = users?.find((user) => user.id.toString() == value);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add an author
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add an author</DialogTitle>
          <DialogDescription>
            Authors are shown on the game page, in the credits section.
            Moreover, just as you are doing, they can edit the game.
          </DialogDescription>
        </DialogHeader>
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={popoverOpen}
              className="w-full justify-between"
            >
              {selectedUser
                ? selectedUser.firstName + " " + selectedUser.lastName
                : "Select a user..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[462px] p-0">
            <Command shouldFilter={false}>
              <CommandInput
                placeholder="Search for a user..."
                value={search}
                onValueChange={setSearch}
              />
              <CommandList>
                <CommandEmpty>
                  {isLoading
                    ? "Loading..."
                    : "No user found. Ensure this user has logged in at least once."}
                </CommandEmpty>
                <CommandGroup>
                  {users?.map((user) => (
                    <CommandItem
                      key={user.id}
                      value={user.id.toString()}
                      onSelect={(currentValue) => {
                        setValue(currentValue === value ? "" : currentValue);
                        setPopoverOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === user.id.toString()
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      <div className="flex flex-col">
                        <span>{user.firstName + " " + user.lastName}</span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <div className="flex items-center justify-between gap-4">
          <Label htmlFor="role" className="text-sm font-medium">
            Role
          </Label>
          <Input
            id="role"
            placeholder="Game Designer"
            className="w-full"
            onChange={(e) => {
              setRoleValue(e.target.value);
            }}
            value={roleValue}
          />
        </div>

        <DialogFooter className="flex justify-between sm:justify-between gap-2">
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button
            onClick={async () => {
              if (!value) return;

              const result = await addAuthor({
                gameId,
                userId: parseInt(value),
                role: roleValue !== "" ? roleValue : undefined,
              });
              setOpen(false);
              setValue("");
              setSearch("");
            }}
          >
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
