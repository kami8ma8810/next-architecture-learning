import { describe, expect, test, beforeEach, afterEach } from "bun:test";
import { createClient } from "@supabase/supabase-js";
import { ReadingTextRepositoryImpl } from "../ReadingTextRepositoryImpl";
import { ReadingText } from "../../../../domain/entity/ReadingText/ReadingText";
import { Difficulty, Category } from "../../../../domain/entity/ReadingText/types";

describe("ReadingTextRepositoryImpl", () => {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const repository = new ReadingTextRepositoryImpl(supabase);

  const testReadingText = ReadingText.create({
    id: "123e4567-e89b-12d3-a456-426614174000",
    content: "テストテキスト",
    difficulty: "BEGINNER" as Difficulty,
    category: "STORY" as Category,
    createdAt: new Date("2024-03-25T00:00:00Z"),
    updatedAt: new Date("2024-03-25T00:00:00Z"),
  });

  beforeEach(async () => {
    // テストデータの投入
    await supabase.from("reading_texts").insert({
      id: testReadingText.id,
      content: testReadingText.content,
      difficulty: testReadingText.difficulty,
      category: testReadingText.category,
      created_at: testReadingText.createdAt.toISOString(),
      updated_at: testReadingText.updatedAt.toISOString(),
    });
  });

  afterEach(async () => {
    // テストデータの削除
    await supabase.from("reading_texts").delete().eq("id", testReadingText.id);
  });

  test("findAllで全てのテキストを取得できる", async () => {
    const texts = await repository.findAll();
    expect(texts).toHaveLength(1);
    expect(texts[0].id).toBe(testReadingText.id);
    expect(texts[0].content).toBe(testReadingText.content);
    expect(texts[0].difficulty).toBe(testReadingText.difficulty);
    expect(texts[0].category).toBe(testReadingText.category);
  });

  test("findByIdで存在するテキストを取得できる", async () => {
    const text = await repository.findById(testReadingText.id);
    expect(text).not.toBeNull();
    expect(text!.id).toBe(testReadingText.id);
    expect(text!.content).toBe(testReadingText.content);
    expect(text!.difficulty).toBe(testReadingText.difficulty);
    expect(text!.category).toBe(testReadingText.category);
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
    const text = await repository.findById(newText.id);
    expect(text).not.toBeNull();
    expect(text!.id).toBe(newText.id);
    expect(text!.content).toBe(newText.content);
    expect(text!.difficulty).toBe(newText.difficulty);
    expect(text!.category).toBe(newText.category);

    // クリーンアップ
    await supabase.from("reading_texts").delete().eq("id", newText.id);
  });

  test("saveで既存のテキストを更新できる", async () => {
    const updatedText = ReadingText.create({
      ...testReadingText,
      content: "更新されたテキスト",
    });

    await repository.save(updatedText);
    const text = await repository.findById(testReadingText.id);
    expect(text).not.toBeNull();
    expect(text!.content).toBe("更新されたテキスト");
  });

  test("deleteでテキストを削除できる", async () => {
    await repository.delete(testReadingText.id);
    const text = await repository.findById(testReadingText.id);
    expect(text).toBeNull();
  });
}); 