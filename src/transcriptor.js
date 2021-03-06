import { parseBoth, parseByName, formatSection } from "parallelizer";

import { getFileContent } from "./helpers/filesystem";
import { glueStringsBy } from "./helpers/string";
import config from "../config/defaultConfig.json";

export const prettifyTranscript = (transcript) =>
  formatSection(glueStringsBy(transcript, "content"));

const getDoubleTranscriptByTimestamp = async (start, end, path1, path2) => {
  const [en, ru] = await Promise.all([
    getFileContent(path1),
    getFileContent(path2),
  ]);

  const transcripts = parseBoth({
    start,
    end,
    firstSubtitles: en,
    secondSubtitles: ru,
  });

  return transcripts;
};

const getDoubleTranscriptByPhrase = async (phrase, path1, path2) => {
  const [en, ru] = await Promise.all([
    getFileContent(path1),
    getFileContent(path2),
  ]);

  if (config.offsetSections) {
    const sections = parseByName(phrase, en, config.offsetSections);

    const { startTime } = sections[0];
    const { endTime } = sections.slice(-1)[0];

    const transcripts = parseBoth({
      start: startTime,
      end: endTime,
      firstSubtitles: en,
      secondSubtitles: ru,
    });

    return transcripts;
  }

  const { startTime, endTime } = parseByName(phrase, en)[0];

  const transcripts = parseBoth({
    start: startTime,
    end: endTime,
    firstSubtitles: en,
    secondSubtitles: ru,
  });

  return transcripts;
};

export const getStartAndEndTimeFromTranscript = (transcript) => {
  const { startTimeWithMs } = transcript[0];
  const { endTimeWithMs } = transcript.slice(-1)[0];

  return { start: startTimeWithMs, end: endTimeWithMs };
};

export const transcriptorByTimestamp = async (start, end, path1, path2) => {
  const transcripts = await getDoubleTranscriptByTimestamp(
    start,
    end,
    path1,
    path2
  );

  return { transcripts, ...getStartAndEndTimeFromTranscript(transcripts[0]) };
};

export const transcriptorByPhrase = async (phrase, path1, path2) => {
  const transcripts = await getDoubleTranscriptByPhrase(phrase, path1, path2);

  return { transcripts, ...getStartAndEndTimeFromTranscript(transcripts[0]) };
};
