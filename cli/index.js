import inquirer from "inquirer";

import { runByTimestamp, runByPhrase } from "../src/index";

const MODES = {
  PHRASE: "Phrase",
  TIMESTAMP: "Timestamp",
};

const QUESTIONS = {
  SELECT_MODE: {
    type: "list",
    choices: Object.values(MODES),
    name: "mode",
    message: "Select cutting mode",
  },
  PHRASE: {
    type: "input",
    name: "phrase",
    message: "Enter a phrase name",
  },
  FILENAME: {
    type: "input",
    name: "filename",
    message: "Enter a file name",
  },
  START_TIME: {
    type: "input",
    name: "startTime",
    message: "Enter a start time",
  },
  END_TIME: {
    type: "input",
    name: "endTime",
    message: "Enter an end time",
  },
};

const cli = async () => {
  const questions = [];

  const { mode } = await inquirer.prompt(QUESTIONS.SELECT_MODE);

  if (mode === MODES.TIMESTAMP) {
    questions.push(
      ...[QUESTIONS.FILENAME, QUESTIONS.START_TIME, QUESTIONS.END_TIME]
    );

    const answers = await inquirer.prompt(questions);

    await runByTimestamp(answers);
  }

  if (mode === MODES.PHRASE) {
    questions.push(QUESTIONS.PHRASE);

    const answers = await inquirer.prompt(questions);

    await runByPhrase(answers);
  }
};

cli();
