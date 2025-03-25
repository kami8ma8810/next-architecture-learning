import { describe, expect, test } from "bun:test";
import { ReadingText } from "../ReadingText";
import { Difficulty, Category } from "../types";

describe("ReadingText", () => {
  const validProps = {
    id: "123e4567-e89b-12d3-a456-426614174000",
    content: "テストテキスト",
    difficulty: "BEGINNER" as Difficulty,
    category: "STORY" as Category,
    createdAt: new Date("2024-03-25T00:00:00Z"),
    updatedAt: new Date("2024-03-25T00:00:00Z"),
  };

  test("正常なプロパティでReadingTextを作成できる", () => {
    const readingText = ReadingText.create(validProps);
    expect(readingText.id).toBe(validProps.id);
    expect(readingText.content).toBe(validProps.content);
    expect(readingText.difficulty).toBe(validProps.difficulty);
    expect(readingText.category).toBe(validProps.category);
    expect(readingText.createdAt).toBe(validProps.createdAt);
    expect(readingText.updatedAt).toBe(validProps.updatedAt);
  });

  test("空のコンテンツでは作成できない", () => {
    expect(() => {
      ReadingText.create({ ...validProps, content: "" });
    }).toThrow("コンテンツは空にできません");
  });

  test("無効な難易度では作成できない", () => {
    expect(() => {
      ReadingText.create({ ...validProps, difficulty: "INVALID" as Difficulty });
    }).toThrow("無効な難易度です");
  });

  test("無効なカテゴリーでは作成できない", () => {
    expect(() => {
      ReadingText.create({ ...validProps, category: "INVALID" as Category });
    }).toThrow("無効なカテゴリーです");
  });

  test("コンテンツを更新できる", () => {
    const readingText = ReadingText.create(validProps);
    const newContent = "新しいテキスト";
    const updatedText = readingText.updateContent(newContent);
    expect(updatedText.content).toBe(newContent);
    expect(updatedText.updatedAt.getTime()).toBeGreaterThan(readingText.updatedAt.getTime());
  });

  test("空のコンテンツには更新できない", () => {
    const readingText = ReadingText.create(validProps);
    expect(() => {
      readingText.updateContent("");
    }).toThrow("コンテンツは空にできません");
  });
}); 