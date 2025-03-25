import { describe, expect, test } from "bun:test";
import { ReadingTextRepository } from "../ReadingTextRepository";
import { ReadingText } from "../../../entity/ReadingText/ReadingText";
import { Difficulty, Category } from "../../../entity/ReadingText/types";

describe("ReadingTextRepository", () => {
  const mockReadingText = ReadingText.create({
    id: "123e4567-e89b-12d3-a456-426614174000",
    content: "テストテキスト",
    difficulty: "BEGINNER" as Difficulty,
    category: "STORY" as Category,
    createdAt: new Date("2024-03-25T00:00:00Z"),
    updatedAt: new Date("2024-03-25T00:00:00Z"),
  });

  class MockReadingTextRepository implements ReadingTextRepository {
    private texts: ReadingText[] = [mockReadingText];

    async findAll(): Promise<ReadingText[]> {
      return this.texts;
    }

    async findById(id: string): Promise<ReadingText | null> {
      return this.texts.find((text) => text.id === id) || null;
    }

    async save(text: ReadingText): Promise<void> {
      const index = this.texts.findIndex((t) => t.id === text.id);
      if (index === -1) {
        this.texts.push(text);
      } else {
        this.texts[index] = text;
      }
    }

    async delete(id: string): Promise<void> {
      this.texts = this.texts.filter((text) => text.id !== id);
    }
  }

  const repository = new MockReadingTextRepository();

  test("findAllで全てのテキストを取得できる", async () => {
    const texts = await repository.findAll();
    expect(texts).toHaveLength(1);
    expect(texts[0]).toEqual(mockReadingText);
  });

  test("findByIdで存在するテキストを取得できる", async () => {
    const text = await repository.findById(mockReadingText.id);
    expect(text).toEqual(mockReadingText);
  });

  test("findByIdで存在しないテキストはnullを返す", async () => {
    const text = await repository.findById("non-existent-id");
    expect(text).toBeNull();
  });

  test("saveで新しいテキストを保存できる", async () => {
    const newText = ReadingText.create({
      id: "123e4567-e89b-12d3-a456-426614174001",
      content: "新しいテキスト",
      difficulty: "INTERMEDIATE" as Difficulty,
      category: "NEWS" as Category,
      createdAt: new Date("2024-03-25T00:00:00Z"),
      updatedAt: new Date("2024-03-25T00:00:00Z"),
    });

    await repository.save(newText);
    const texts = await repository.findAll();
    expect(texts).toHaveLength(2);
    expect(texts[1]).toEqual(newText);
  });

  test("saveで既存のテキストを更新できる", async () => {
    const updatedText = ReadingText.create({
      ...mockReadingText,
      content: "更新されたテキスト",
    });

    await repository.save(updatedText);
    const text = await repository.findById(mockReadingText.id);
    expect(text).toEqual(updatedText);
  });

  test("deleteでテキストを削除できる", async () => {
    await repository.delete(mockReadingText.id);
    const texts = await repository.findAll();
    expect(texts).toHaveLength(0);
  });
}); 