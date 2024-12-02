// mathUtils.test.ts
import { describe, expect, test } from "@jest/globals";
import callChatGPT from "./sentencesRhymed";


describe("sentence are rhymed", () => {
  test("check if two sentences are rhymed", () => {
    expect(callChatGPT("hat cat")).toBe(true);
  });
});
