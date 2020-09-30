import inquirer from "inquirer";
import chalk from "chalk";

import { runByTimestamp, runByPhrase } from "../src/index";
import { getCache } from "../src/cache";

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
  LOAD_CACHE: {
    type: "confirm",
    name: "loadCache",
    message: "Do you want to fill out the field using cache?",
  },
};

const cli = async () => {
  try {
    const questions = [];

    const { mode } = await inquirer.prompt(QUESTIONS.SELECT_MODE);

    if (mode === MODES.TIMESTAMP) {
      const { filename } = await inquirer.prompt([QUESTIONS.FILENAME]);
      let time,
        options = {};

      questions.push(...[QUESTIONS.START_TIME, QUESTIONS.END_TIME]);

      const cache = await getCache(filename);

      if (!cache) {
        time = await inquirer.prompt(questions);

        options = {
          filename,
          ...time,
        };
      } else {
        const { loadCache } = await inquirer.prompt([QUESTIONS.LOAD_CACHE]);

        if (loadCache) {
          options = cache;
        } else {
          time = await inquirer.prompt(questions);

          options = {
            filename,
            ...time,
          };
        }
      }

      await runByTimestamp(options);
    }

    if (mode === MODES.PHRASE) {
      questions.push(QUESTIONS.PHRASE);

      const answers = await inquirer.prompt(questions);

      await runByPhrase(answers);
    }
  } catch (err) {
    console.log(chalk.red(err.message));
  }
};

cli();
