import { describe, expect, test } from "bun:test";
import { ReadingRecord } from "../ReadingRecord";
import { ReadingText } from "../../ReadingText/ReadingText";
import { Difficulty, Category } from "../../ReadingText/types";

describe("ReadingRecord", () => {
  const readingText = ReadingText.create({
    id: "123e4567-e89b-12d3-a456-426614174000",
    content: "テストテキスト",
    difficulty: "BEGINNER" as Difficulty,
    category: "STORY" as Category,
    createdAt: new Date("2024-03-25T00:00:00Z"),
    updatedAt: new Date("2024-03-25T00:00:00Z"),
  });

  const validProps = {
    id: "123e4567-e89b-12d3-a456-426614174001",
    readingText,
    audioUrl: "https://example.com/audio.mp3",
    duration: 60,
    score: 85,
    createdAt: new Date("2024-03-25T00:00:00Z"),
    updatedAt: new Date("2024-03-25T00:00:00Z"),
  };

  test("正常なプロパティでReadingRecordを作成できる", () => {
    const readingRecord = ReadingRecord.create(validProps);
    expect(readingRecord.id).toBe(validProps.id);
    expect(readingRecord.readingText).toBe(validProps.readingText);
    expect(readingRecord.audioUrl).toBe(validProps.audioUrl);
    expect(readingRecord.duration).toBe(validProps.duration);
    expect(readingRecord.score).toBe(validProps.score);
    expect(readingRecord.createdAt).toBe(validProps.createdAt);
    expect(readingRecord.updatedAt).toBe(validProps.updatedAt);
  });

  test("無効な音声URLでは作成できない", () => {
    expect(() => {
      ReadingRecord.create({ ...validProps, audioUrl: "" });
    }).toThrow("音声URLは空にできません");
  });

  test("負の録音時間では作成できない", () => {
    expect(() => {
      ReadingRecord.create({ ...validProps, duration: -1 });
    }).toThrow("録音時間は0秒以上3600秒以下である必要があります");
  });

  test("3600秒を超える録音時間では作成できない", () => {
    expect(() => {
      ReadingRecord.create({ ...validProps, duration: 3601 });
    }).toThrow("録音時間は0秒以上3600秒以下である必要があります");
  });

  test("負のスコアでは作成できない", () => {
    expect(() => {
      ReadingRecord.create({ ...validProps, score: -1 });
    }).toThrow("スコアは0以上100以下である必要があります");
  });

  test("100を超えるスコアでは作成できない", () => {
    expect(() => {
      ReadingRecord.create({ ...validProps, score: 101 });
    }).toThrow("スコアは0以上100以下である必要があります");
  });

  test("スコアを更新できる", () => {
    const readingRecord = ReadingRecord.create(validProps);
    const newScore = 90;
    const updatedRecord = readingRecord.updateScore(newScore);
    expect(updatedRecord.score).toBe(newScore);
    expect(updatedRecord.updatedAt.getTime()).toBeGreaterThan(readingRecord.updatedAt.getTime());
  });

  test("無効なスコアには更新できない", () => {
    const readingRecord = ReadingRecord.create(validProps);
    expect(() => {
      readingRecord.updateScore(-1);
    }).toThrow("スコアは0以上100以下である必要があります");
  });
}); 