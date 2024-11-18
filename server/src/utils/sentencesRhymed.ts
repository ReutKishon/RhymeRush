// import { HfInference } from "@huggingface/inference";
import OpenAI from "openai";

import dotenv from "dotenv";
dotenv.config();
// const hf = new HfInference(process.env.HAGGING_FACE_TOKEN);

const sentencesRhyme = async (sentence1: string, sentence2: string) => {
  //   const lastWord1 = getLastWord(sentence1);
  //   const lastWord2 = getLastWord(sentence2);
  //   console.log("here: ", process.env.HAGGING_FACE_TOKEN);
  const lastWord1 = "shy";
  const lastWord2 = "clock";

  const openai = new OpenAI({apiKey: process.env.OPEN_AI_KEY});

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You need to check if two words rhyme, answear yes/no" },
      {
        role: "user",
        content: `Do ${lastWord1} and ${lastWord2} rhyme?}`,
      },
    ],
  });

  console.log(completion.choices[0].message);
  //   console.log(res.answer);
  return true;
};

// Helper function to get the last word from a sentence
function getLastWord(sentence: string): string {
  const words = sentence.trim().split(" ");
  return words[words.length - 1].toLowerCase();
}

export default sentencesRhyme;
