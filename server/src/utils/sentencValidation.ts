import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

// OpenAI API key
const apiKey = process.env.OPEN_AI_KEY;

async function callChatGPT(content: string, prompt: string) {
  const url = "https://api.openai.com/v1/chat/completions";

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };

  const data = {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content,
      },
      { role: "user", content: prompt },
    ],
  };

  try {
    const response = await axios.post(url, data, { headers });
    // console.log(JSON.stringify(response.data, null, 2));
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function isTwoWordsRhyme(prompt: string): Promise<boolean> {
  const content =
    "You are an assistant that checks if two words rhyme. Respond only with 'yes' or 'no'.";
  const response = await callChatGPT(content, prompt);
  const result = response.data.choices[0].message.content;
  console.log("isTwoWordsRhyme :", result);

  return result === "yes";
}

export async function isRelatedToTopic(prompt: string): Promise<boolean> {
  const content =
    "You are an assistant that checks if a sentence is related to a topic. Respond only with 'yes' or 'no'.";
  const response = await callChatGPT(content, prompt);
  const result = response.data.choices[0].message.content;
  console.log("isRelatedToTopic:", result);
  return result === "yes";
}

export const sentencesAreRhyme = async (
  s1: string,
  s2: string
): Promise<boolean> => {
  const s1_words = s1.split(" ");
  const s2_words = s2.split(" ");

  const word1 = s1_words[s1_words.length - 1];
  const word2 = s2_words[s2_words.length - 1];
  const prompt = `${word1},${word2}`;
  return await isTwoWordsRhyme(prompt);
};

export const relatedToTopic = async (
  topic: string,
  sentence: string
): Promise<boolean> => {
  const prompt = `topic:${topic},sentence:${sentence}`;
  return await isRelatedToTopic(prompt);
};
