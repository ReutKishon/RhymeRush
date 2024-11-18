// mathUtils.test.ts
import { describe, expect, test } from "@jest/globals";
import sentencesRhyme from "./sentencesRhymed";
let sentence1 = "The cat sat on the mat";
let sentence2 = "He took off his hat";

describe("sentence are rhymed", () => {
  test("check if two sentences are rhymed", () => {
    expect(sentencesRhyme("hat", "cat")).toBe(true);
  });
});
