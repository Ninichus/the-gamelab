"use server";
import { getFiles } from "@/lib/actions/files/get-files";
import { File } from "lucide-react";
import { Error } from "@/components/error";
import { DeleteFile } from "./delete-file";
import { AddFile } from "./add-file";
import Link from "next/link";

export async function FilesList({
  game,
  edit = false,
}: {
  game: { id: string };
  edit?: boolean;
}) {
  const result = await getFiles(game.id);
  if (!result.success) {
    return <Error message={result.error} />;
  }

  return (
    <>
      <ul className="flex flex-col gap-2">
        {result.files.map((file) => (
          <li
            key={file.id}
            className="flex items-center justify-between gap-4 p-2 border-b border-b-slate-200 dark:border-b-slate-700"
          >
            <div className="flex items-center gap-4">
              <File />
              <span className="text-sm font-medium text-slate-900 dark:text-slate-50">
                {file.name}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {file.downloadCount} downloads
              </span>
              <a href={`/download/${file.id}`} download>
                <span className="text-xs text-blue-500 dark:text-blue-400">
                  Download
                </span>
              </a>
              {edit && <DeleteFile fileId={file.id} gameId={game.id} />}
            </div>
          </li>
        ))}
      </ul>
      {result.files.length === 0 && (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          No files uploaded yet.
        </p>
      )}
      {edit && <AddFile gameId={game.id} index={result.files.length} />}
    </>
  );
}
