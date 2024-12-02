import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

// OpenAI API key
const apiKey = process.env.OPEN_AI_KEY;

async function callChatGPT(prompt: string) {
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
        content:
          "You are an assistant that checks if two words rhyme. Respond only with 'yes' or 'no'.",
      },
      { role: "user", content: prompt },
    ],
  };

  try {
    const response = await axios.post(url, data, { headers });
    const result = response.data.choices[0].message.content;
    return result === "yes";
  } catch (error) {
    console.error(
      "Error calling ChatGPT API:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }

}

export default callChatGPT;
