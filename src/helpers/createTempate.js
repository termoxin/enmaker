export const createTemplate = (phrase, transcripts) => `${phrase}${
  phrase.split(" ").length === 1 ? " | |" : ""
} —

${transcripts}
`;
