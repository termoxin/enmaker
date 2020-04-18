import path from "path";
import ffmpeg from "fluent-ffmpeg";
import {
  getFileContent,
  getSectionByWord,
  srtTimeToSeconds,
} from "parallelizer";

import chalk from "chalk";

const phrase = process.argv.slice(2).join(" ");

const createOutPutPath = (filename) =>
  path.resolve(__dirname, "../output", `${filename}.mp4`);

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

const runCutter = async () => {
  if (phrase) {
    const en = await getFileContent(path.resolve(__dirname, "../en.srt"));
    const moviePath = path.resolve(__dirname, "../", "movie.mp4");

    const { startTimeWithMs, endTimeWithMs } = getSectionByWord(phrase, en)[0];

    await cut(phrase, moviePath, startTimeWithMs, endTimeWithMs);
    console.log(chalk.green("You've got it 👍"));
  } else {
    console.log(chalk.red("Please provide a phrase🙏"));
  }
};

runCutter();
