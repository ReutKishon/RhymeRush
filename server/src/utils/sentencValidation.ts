import axios from "axios";
import dotenv from "dotenv";
import { Game } from "types/gameTypes";

dotenv.config();

// OpenAI API key
const apiKey = process.env.OPEN_AI_KEY;

export const evaluateSentence = async (game: Game, sentence: string) => {
  const prompt = `
 You are an expert lyric evaluator for a collaborative songwriting game. Evaluate the player's submitted sentence based on the following criteria and return the results as a JSON object.

1. Topic Relation: Rate how well the sentence aligns with the given topic. (0-10)
2. Song Relevance: Rate how well the sentence fits with the context and flow of the song so far. (0-10)
3. Rhyme Score: Rate whether the sentence rhymes with the previous sentence. If the input sentence is even-numbered in the song, skip this criterion.

Return the following fields in the JSON object:
- "topicRelation": <integer between 0 and 10>
- "songRelevance": <integer between 0 and 10>
- "rhymeScore": <integer between 0 and 10> or null if this criterion is skipped.
- "finalScore": <integer average of the above criteria>.

Input structure:
{
  "topic": "<TOPIC>",
  "songSoFar": "<SONG_SO_FAR>",
  "playerSentence": "<PLAYER_SENTENCE>"
}

Note: Ensure The songSoFar sentences are separated by '*' and are 0-indexed.

Return a JSON object with this structure:
{
  "topicRelation": <integer>,
  "songRelevance": <integer>,
  "rhymeScore": <integer>,
  "finalScore": <integer>,
}
   `;
  const url = "https://api.openai.com/v1/chat/completions";
  console.log(game.lyrics);
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };

  const data = {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: prompt, // Change `prompt` to content in system message
      },
      {
        role: "user",
        content: JSON.stringify({
          topic: game.topic,
          songSoFar: game.lyrics.map((sentence) => sentence.content).join("*"),
          playerSentence: sentence,
        }), // Pass content as a string
      },
    ],
  };

  try {
    const response = await axios.post(url, data, { headers });
    return response.data; // Make sure to return the response data
  } catch (error) {
    console.error(error);
    throw error;
  }
};
