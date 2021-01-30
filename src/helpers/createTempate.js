export const createTemplate = (phrase, pronunciation, transcripts) => `${phrase}${
  phrase.split(" ").length === 1 ? ` |${pronunciation}|` : ""
} —

${transcripts}
`;