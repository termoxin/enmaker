import path from "path";
import ffmpeg from "fluent-ffmpeg";
import chalk from "chalk";
import { srtTimeToSeconds } from "parallelizer";

import { toSnakeCase } from "./helpers/string";

export const createOutPutPath = (filename, ext = ".mp4") =>
  path.resolve(__dirname, "../output", `${toSnakeCase(filename)}${ext}`);

const cut = (filename, path, start, end) => {
  const startTimeInSeconds = srtTimeToSeconds(start);

  const duration = srtTimeToSeconds(end) - startTimeInSeconds;

  return new Promise((resolve, reject) => {
    ffmpeg(path)
      .setStartTime(startTimeInSeconds)
      .setDuration(duration)
      .output(createOutPutPath(filename))
      .on("end", resolve)
      .on("error", reject)
      .run();
  });
};

export const cutter = async (filename, path, start, end) => {
  if (filename) {
    const result = await cut(filename, path, start, end);

    console.log(
      chalk.green(
        `You've got it as ${chalk.bold.gray(`${toSnakeCase(filename)}.mp4`)} 👍`
      )
    );

    return result;
  } else {
    console.log(chalk.red("Please provide a phrase🙏"));
  }
};
