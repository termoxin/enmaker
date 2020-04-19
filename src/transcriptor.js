import { getFileContent, getSections, glueStringsBy } from "parallelizer";

export const prettifyTranscript = (transcript) =>
  `${glueStringsBy(transcript, "content")}\n`;

const getDoubleTranscript = async (start, end, path1, path2) => {
  const [en, ru] = await Promise.all([
    getFileContent(path1),
    getFileContent(path2),
  ]);

  const transcripts = getSections({
    start,
    end,
    firstLanguage: en,
    secondLanguage: ru,
    secondLanguageSplitter: "\r\n",
  });

  return transcripts;
};

export const transcriptor = async (start, end, path1, path2) => {
  const transcripts = await getDoubleTranscript(start, end, path1, path2);

  const { startTimeWithMs } = transcripts[0][0];
  const { endTimeWithMs } = transcripts[0].slice(-1)[0];

  return { transcripts, start: startTimeWithMs, end: endTimeWithMs };
};
