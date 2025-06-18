import { spawn } from "child_process";
import { writeFile, unlink, readFile } from "fs/promises";
import path from "path";
import os from "os";

export async function extractThumbnail(
  file: File,
  fileId: string
): Promise<File> {
  const tempInputPath = path.join(os.tmpdir(), `${fileId}-input.mp4`);
  const tempOutputPath = path.join(os.tmpdir(), `${fileId}-thumb.jpg`);

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(tempInputPath, buffer);

  await new Promise((resolve, reject) => {
    const ffmpeg = spawn("ffmpeg", [
      "-i",
      tempInputPath,
      "-ss",
      "00:00:01.000",
      "-vframes",
      "1",
      "-vf",
      "scale=320:-1",
      tempOutputPath,
    ]);

    ffmpeg.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`FFmpeg exited with code ${code}`));
      } else {
        resolve(true);
      }
    });
  });

  const thumbBuffer = await readFile(tempOutputPath);

  // Clean up temp files
  await unlink(tempInputPath);
  await unlink(tempOutputPath);

  return new File([thumbBuffer], `${file.name}-thumbnail.jpg`, {
    type: "image/jpeg",
  });
}
