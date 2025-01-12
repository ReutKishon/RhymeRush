import OpenAI from "openai";
import { evaluateSentence } from "./evaluateSentence";
import { Sentence } from "../../../shared/types/gameTypes";

describe("evaluateSentence", () => {
  it("should return a response with the correct structure", async () => {
    // Arrange
    const mockResponse = {
      choices: [
        {
          message: {
            content: JSON.stringify({
              rhyme_quality: 8,
              flow_relevance: 9,
              topic_relevance: 7,
              general_score: 8,
              comments: "Good flow and decent rhyme, slightly off-topic.",
            }),
          },
        },
      ],
    };

    jest.mock("openai", () => {
      return jest.fn().mockImplementation(() => {
        return {
          completions: {
            create: jest.fn().mockImplementation(async () => {
              return mockResponse.choices;
            }),
          },
        };
      });
    });

    const sentence = "This is a test sentence.";
    const lyrics = ["Previous sentence."];
    const topic = "Poetry";

    // Act
    const result = await evaluateSentence(sentence, lyrics, topic);

    // Assert
    // Check if the response has the correct structure
    const responseBody = JSON.parse(result.choices[0].message.content);
    expect(responseBody).toHaveProperty("rhyme_quality");
    expect(responseBody).toHaveProperty("flow_relevance");
    expect(responseBody).toHaveProperty("topic_relevance");
    expect(responseBody).toHaveProperty("general_score");
    expect(responseBody).toHaveProperty("comments");
  });
});
