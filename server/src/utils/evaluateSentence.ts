import dotenv from "dotenv";
import { OpenAI } from "openai";
import { Sentence } from "../../../shared/types/gameTypes";

dotenv.config();

export const evaluateSentence = async (
  sentence: string,
  lyrics: string[],
  topic: string
): Promise<OpenAI.Chat.Completions.ChatCompletion> => {
  const prompt = `
You are a creative writing and poetry expert tasked with evaluating sentences based on four criteria. 

Here is your task:
1. **Rhyme Quality**: Evaluate how well the last word of the given sentence rhymes with the last word of the previous sentence.
   - Score: 0-10 (0 = no rhyme, 10 = perfect rhyme).
2. **Flow Relevance**: Assess how well the given sentence flows and relates to the context of the previous sentences.
   - Score: 0-10 (0 = completely unrelated, 10 = seamlessly connected).
3. **Topic Relevance**: Evaluate how well the given sentence adheres to the given topic.
   - Score: 0-10 (0 = completely off-topic, 10 = highly relevant).
4. **General Score**: Combine the above three criteria into a single overall score. Use an average to calculate the score (sum of all scores divided by 3). 

**Input Details**:
- **Given Sentence**: "${sentence}"
- **All Previous Sentences**: ${JSON.stringify(lyrics)}
- **Topic**: "${topic}"

**Output Format**:
Provide a JSON response in this format:
{
  "rhyme_quality": <score>,
  "flow_relevance": <score>,
  "topic_relevance": <score>,
  "general_score": <score>,
  "comments": "<brief analysis of the evaluation>"
}

Now evaluate the given sentence using this approach.
  `;
  const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_KEY,
  });

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt },
      ],
      max_tokens: 300,
    });
    return response;
  } catch (error) {
    console.error(error);
  }
};
