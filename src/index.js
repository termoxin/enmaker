import path from "path";
import { promises as fs } from "fs";
import chalk from "chalk";

import config from "../config/defaultConfig.json";
import { cutter, createOutPutPath } from "./cutter";

import {
  transcriptorByTimestamp,
  prettifyTranscript,
  transcriptorByPhrase,
} from "./transcriptor.js";
import { saveCache } from "./cache";

const __dirname = path.resolve();

const moviePath = path.resolve(__dirname, config.video);
const enSrtPath = path.resolve(__dirname, config.firstSubtitles);
const ruSrtPath = path.resolve(__dirname, config.secondSubtitles);

export const runByTimestamp = async (options) => {
  try {
    const { filename, startTime, endTime, offsetStart, offsetEnd } = options;

    const {
      transcripts: [enTranscript, ruTranscript],
      start,
      end,
    } = await transcriptorByTimestamp(startTime, endTime, enSrtPath, ruSrtPath);

    await cutter(filename, moviePath, start, end, offsetStart, offsetEnd);

    await fs.writeFile(
      path.resolve(createOutPutPath(filename, ".txt")),
      `${prettifyTranscript(enTranscript)}\n${prettifyTranscript(ruTranscript)}`
    );

    await saveCache(filename, {
      filename,
      startTime,
      endTime,
    });
  } catch (err) {
    console.log(chalk.red(err.message));
  }
};

export const runByPhrase = async ({ phrase, offsetStart, offsetEnd }) => {
  try {
    const {
      transcripts: [enTranscript, ruTranscript],
      start,
      end,
    } = await transcriptorByPhrase(phrase, enSrtPath, ruSrtPath);

    await cutter(phrase, moviePath, start, end, offsetStart, offsetEnd);

    await fs.writeFile(
      path.resolve(createOutPutPath(phrase, ".txt")),
      `${prettifyTranscript(enTranscript)}\n${prettifyTranscript(ruTranscript)}`
    );
  } catch (err) {
    console.log(chalk.red(err.message));
  }
};
