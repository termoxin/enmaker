import path from "path";
import { promises as fs } from "fs";
import args from "args";

import { cutter, createOutPutPath } from "./cutter";
import { transcriptor, prettifyTranscript } from "./transcriptor";

const moviePath = path.resolve(__dirname, "../", "movie.mp4");
const enSrtPath = path.resolve(__dirname, "../en.srt");
const ruSrtPath = path.resolve(__dirname, "../ru.srt");

const run = async () => {
  args
    .option("filename", "The name with which the file will be saved")
    .option("startTime", "The first(start) timestamp")
    .option("endTime", "The second(end) timestamp");

  const { filename, startTime, endTime } = args.parse(process.argv);

  const {
    transcripts: [enTranscript, ruTranscript],
    start,
    end,
  } = await transcriptor(startTime, endTime, enSrtPath, ruSrtPath);

  await cutter(filename, moviePath, start, end);

  await fs.writeFile(
    path.resolve(createOutPutPath(filename, ".txt")),
    `${prettifyTranscript(enTranscript)}\n${prettifyTranscript(ruTranscript)}`
  );
};

run();
