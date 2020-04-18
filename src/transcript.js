import path from "path";
import { getFileContent, getSections, glueStringsBy } from "parallelizer";

const [start, end] = process.argv.slice(2);

const getDoubleTranscript = async (start, end) => {
  const [en, ru] = await Promise.all([
    getFileContent(path.resolve(__dirname, "../en.srt")),
    getFileContent(path.resolve(__dirname, "../ru.srt")),
  ]);

  const transcripts = getSections({
    start,
    end,
    firstLanguage: en,
    secondLanguage: ru,
    secondLanguageSplitter: "\r\n",
  });

  return prettifyDoubleTranscript(transcripts);
};

const prettifyDoubleTranscript = ([englishTranscript, russianTranscript]) =>
  `${glueStringsBy(englishTranscript, "content")}\n\n${glueStringsBy(
    russianTranscript,
    "content"
  )}`;

getDoubleTranscript(start, end).then((data) => {
  console.log(data);
});
