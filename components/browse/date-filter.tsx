import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { fr } from "date-fns/locale";

export function DateFilter({
  title,
  selected,
  onSelect,
}: {
  title: string;
  selected?: { from: Date | undefined; to?: Date | undefined };
  onSelect: (selected?: {
    from: Date | undefined;
    to?: Date | undefined;
  }) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="border-dashed border-2">
          {title}
          {selected?.from
            ? `: ${selected.from.toLocaleDateString()} - ${
                selected.to?.toLocaleDateString() ?? "?"
              }`
            : ""}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <Calendar
          mode="range"
          locale={fr}
          selected={selected}
          onSelect={onSelect}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
