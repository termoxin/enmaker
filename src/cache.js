import { promises as fs } from "fs";
import path from "path";

const __dirname = path.resolve();

const cacheDirectoryPath = path.resolve(__dirname, "cache");

export const saveCache = async (name, value) => {
  const newFilePath = path.resolve(cacheDirectoryPath, name);
  const data = JSON.stringify(value);

  return fs.writeFile(newFilePath, data);
};

export const getCache = async (name) => {
  try {
    const filePath = path.resolve(cacheDirectoryPath, name);
    const cache = await fs.readFile(filePath);

    return JSON.parse(cache);
  } catch (err) {
    return undefined;
  }
};
