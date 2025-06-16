"use client";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Plus } from "lucide-react";
import { useState } from "react";
import { addTag } from "@/lib/actions/tags/add-tag";

//TODO handle errors

export function AddTag({
  gameId,
  tags,
  currentTags,
}: {
  gameId: string;
  tags: { name: string }[];
  currentTags: { name: string }[];
}) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Badge
          className="cursor-pointer sm:w-auto w-full sm:inline-flex"
          aria-expanded={open}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Tag
        </Badge>
      </PopoverTrigger>
      <PopoverContent className="w-[462px] p-0">
        <Command>
          <CommandInput
            placeholder="Enter a tag..."
            className="h-9"
            onValueChange={(value: string) => setSearchValue(value)}
          />
          <CommandList>
            {searchValue ? (
              <CommandEmpty
                onClick={async () => {
                  await addTag({ gameId, tagName: searchValue });
                  setOpen(false);
                }}
                className="flex items-center justify-center gap-1 italic hover:bg-accent hover:text-accent-foreground"
              >
                {`Create the tag : ${searchValue}`}
              </CommandEmpty>
            ) : (
              <CommandEmpty className="flex items-center italic justify-center gap-1">
                Please type a tag name...
              </CommandEmpty>
            )}

            <CommandGroup>
              {tags
                .filter((tag) => !currentTags.includes(tag))
                .map((tag) => (
                  <CommandItem
                    key={tag.name}
                    value={tag.name}
                    onSelect={async (currentValue: string) => {
                      await addTag({ gameId, tagName: currentValue });
                      setOpen(false);
                    }}
                  >
                    {tag.name}
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
