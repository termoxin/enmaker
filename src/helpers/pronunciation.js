import fetch from "node-fetch";

export const getPronunciation = async (word) => {
  try {
    const response = await fetch(
      `https://owlbot.info/api/v4/dictionary/${encodeURIComponent(word)}`,
      {
        headers: {
          Authorization: `Token ${process.env.OWLBOT_TOKEN}`,
        },
      }
    );

    const data = await response.json();

    return data.pronunciation;
  } catch (err) {
    return "";
  }
};
