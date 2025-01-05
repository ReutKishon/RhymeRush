import axios from "axios";
import dotenv from "dotenv";
import { Game } from "types/gameTypes";

dotenv.config();

// OpenAI API key
const apiKey = process.env.OPEN_AI_KEY;

export const evaluateSentence = async (game: Game, sentence: string) => {
  const prompt = `
  You are an expert lyric evaluator for a collaborative songwriting game. Evaluate the player's submitted sentence based on the following criteria and return the results as a JSON object.

1. **Topic Relation**: Rate how well the sentence aligns with the given topic. (0-10)
2. **Song Relevance**: Rate how well the sentence fits with the context and flow of the song so far. (0-10)
   - If there are no previous lyrics, skip the Song Relevance (do not include it in the average score)
3. **Rhyme**: Rate whether the sentence rhymes with the previous sentence.
   - Only evaluate rhyme if the line number is even. For odd-numbered lines, skip the rhyme evaluation (do not include it in the average score).
4. **Final Score**: Calculate the average of the three scores and convert it to an integer. If rhyme is not evaluated (for odd-numbered lines), divide the total score by 2 instead of 3.

Input structure:
{
  "topic": "<TOPIC>",
  "songSoFar": "<SONG_SO_FAR>",
  "playerSentence": "<PLAYER_SENTENCE>",
  "lineNumber": <LINE_NUMBER>
}

- Make sure to separate the field in the \`songSoFar\` by considering \`*\` as a sentence delimiter.
- Return a JSON object with this structure:
{
  "topicRelation": <integer between 0 and 10>,
  "songRelevance": <integer between 0 and 10>,
  "isRhyme": <integer between 0 and 10> (skip this field for odd-numbered lines),
  "finalScore": <integer average of the above> (divide by 2 if no rhyme is evaluated)
}
   `;
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
