"use server";
import { getFiles } from "@/lib/actions/files/get-files";
import { Download, File } from "lucide-react";
import { Error } from "@/components/error";
import { DeleteFile } from "./delete-file";
import { AddFile } from "./add-file";

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
        {edit
          ? result.files.map((file) => (
              <div key={file.id}>
                <li className="p-4 flex justify-between items-center hover:bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-orange-500/10 rounded-md">
                  <div className="flex gap-2 items-center">
                    <File />
                    <h3 className="text-lg font-semibold">{file.name}</h3>
                  </div>
                  <div className="flex gap-4 items-center text-sm">
                    <span>{`Downloaded ${file.downloadCount} time${
                      file.downloadCount > 1 ? "s" : ""
                    }`}</span>
                    <a href={`/download/${file.id}`} download>
                      <Download
                        className="h-4 w-4 text-muted-foreground hover:text-foreground"
                        aria-hidden="true"
                      />
                    </a>
                    {edit && <DeleteFile gameId={game.id} fileId={file.id} />}
                  </div>
                </li>
              </div>
            ))
          : result.files.map((file) => (
              <a href={`/download/${file.id}`} download key={file.id}>
                <li className="p-4 flex justify-between items-center hover:bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-orange-500/10 rounded-md">
                  <div className="flex gap-2 items-center">
                    <File />
                    <h3 className="text-lg font-semibold">{file.name}</h3>
                  </div>
                  <div className="flex gap-4 items-center text-sm">
                    <span>{`Downloaded ${file.downloadCount} time${
                      file.downloadCount > 1 ? "s" : ""
                    }`}</span>
                    <Download
                      className="h-4 w-4 text-muted-foreground"
                      aria-hidden="true"
                    />
                  </div>
                </li>
              </a>
            ))}
      </ul>
      {result.files.length === 0 && (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          No files uploaded yet.
        </p>
      )}
      {edit && (
        <div className="mt-2">
          <AddFile gameId={game.id} index={result.files.length} />
        </div>
      )}
    </>
  );
}
