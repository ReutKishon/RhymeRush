// mathUtils.test.ts
import { describe, expect, test } from "@jest/globals";
import {  isRelatedToTopic, sentencesAreRhyme } from "./sentencValidation";

describe("sentence are rhymed", () => {
  test("check if two sentences are rhymed", async () => {
    expect(await sentencesAreRhyme("something short", "something court")).toBe(
      true
    );
  });
});

describe("relation to topic", () => {
  test("check if a sentence is related to topic", async () => {
    expect(
      await isRelatedToTopic("Love and relationship", "I sent you flowers")
    ).toBe(true);
  });
  test("check if a sentence is not related to topic", async () => {
    expect(
      await isRelatedToTopic(
        "Love and relationship",
        "I'll go to sleep early today"
      )
    ).toBe(false);
  });
  test("Celebration and Joy", async () => {
    expect(
      await isRelatedToTopic(
        "Celebration and Joy",
        "Hi whats up you guys"
      )
    ).toBe(false);
  });
});
