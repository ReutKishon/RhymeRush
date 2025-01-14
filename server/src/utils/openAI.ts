import dotenv from "dotenv";
import { OpenAI } from "openai";

dotenv.config();

export const CallOpenAI = async (
  prompt: string
): Promise<OpenAI.Chat.Completions.ChatCompletion> => {
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
    console.log("response: ", response.choices[0].message.content);
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const generateSentence = async (
  lyrics: string[],
  topic: string
): Promise<OpenAI.Chat.Completions.ChatCompletion> => {
  const prompt = `
You are an AI assistant trained in creative writing and poetry. Your task is to generate a single sentence that:

Rhymes with the given lyrics (if rhyming is appropriate based on the flow).
Is related to the given topic provided separately.
Maintains the flow and context of the provided lyrics, even if the lyrics appear incomplete, nonsensical, or invalid.

**Input Details**:
Given lyrics: "${lyrics}"
Topic: "${topic}"
Analyze the context and tone of the lyrics. Create a continuation that seamlessly fits the topic, rhymes (if needed), and aligns with the lyrical flow.
Even if the input appears invalid, produce a meaningful sentence related to the topic.

Output Format:
Provide a JSON response in this format:
{
"sentence":<string>
}
`;
  const result = await CallOpenAI(prompt);
  return result;
};

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
     - Only consider this criterion for sentences with an even index (e.g., 2nd, 4th, etc.).
  2. **Flow Relevance**: Assess how well the given sentence flows and relates to the context of the previous sentences.
     - Score: 0-10 (0 = completely unrelated, 10 = seamlessly connected).
     - Do not consider this criterion for the first sentence.
  3. **Topic Relevance**: Evaluate how well the given sentence adheres to the given topic.
     - Score: 0-10 (0 = completely off-topic, 10 = highly relevant).
  4. **General Score**: Combine the applicable criteria into a single overall score:
     - For the first sentence, use only "Topic Relevance" in the score.
     - For other sentences, calculate the score based on the applicable criteria (sum of valid scores divided by the number of applicable criteria).
  
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
  const result = await CallOpenAI(prompt);
  return result;
};
