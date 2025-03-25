import { describe, expect, test, beforeEach, afterEach } from "bun:test";
import { createClient } from "@supabase/supabase-js";
import { ReadingRecordRepositoryImpl } from "../ReadingRecordRepositoryImpl";
import { ReadingRecord } from "../../../../domain/entity/ReadingRecord/ReadingRecord";
import { ReadingText } from "../../../../domain/entity/ReadingText/ReadingText";
import { Difficulty, Category } from "../../../../domain/entity/ReadingText/types";

describe("ReadingRecordRepositoryImpl", () => {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const repository = new ReadingRecordRepositoryImpl(supabase);

  const testReadingText = ReadingText.create({
    id: "123e4567-e89b-12d3-a456-426614174000",
    content: "テストテキスト",
    difficulty: "BEGINNER" as Difficulty,
    category: "STORY" as Category,
    createdAt: new Date("2024-03-25T00:00:00Z"),
    updatedAt: new Date("2024-03-25T00:00:00Z"),
  });

  const testReadingRecord = ReadingRecord.create({
    id: "123e4567-e89b-12d3-a456-426614174001",
    readingText: testReadingText,
    audioUrl: "https://example.com/audio.mp3",
    duration: 60,
    score: 85,
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

    await supabase.from("reading_records").insert({
      id: testReadingRecord.id,
      reading_text_id: testReadingRecord.readingText.id,
      audio_url: testReadingRecord.audioUrl,
      duration: testReadingRecord.duration,
      score: testReadingRecord.score,
      created_at: testReadingRecord.createdAt.toISOString(),
      updated_at: testReadingRecord.updatedAt.toISOString(),
    });
  });

  afterEach(async () => {
    // テストデータの削除
    await supabase.from("reading_records").delete().eq("id", testReadingRecord.id);
    await supabase.from("reading_texts").delete().eq("id", testReadingText.id);
  });

  test("findAllで全ての記録を取得できる", async () => {
    const records = await repository.findAll();
    expect(records).toHaveLength(1);
    expect(records[0].id).toBe(testReadingRecord.id);
    expect(records[0].readingText.id).toBe(testReadingText.id);
    expect(records[0].audioUrl).toBe(testReadingRecord.audioUrl);
    expect(records[0].duration).toBe(testReadingRecord.duration);
    expect(records[0].score).toBe(testReadingRecord.score);
  });

  test("findByIdで存在する記録を取得できる", async () => {
    const record = await repository.findById(testReadingRecord.id);
    expect(record).not.toBeNull();
    expect(record!.id).toBe(testReadingRecord.id);
    expect(record!.readingText.id).toBe(testReadingText.id);
    expect(record!.audioUrl).toBe(testReadingRecord.audioUrl);
    expect(record!.duration).toBe(testReadingRecord.duration);
    expect(record!.score).toBe(testReadingRecord.score);
  });

  test("findByIdで存在しない記録はnullを返す", async () => {
    const record = await repository.findById("non-existent-id");
    expect(record).toBeNull();
  });

  test("findByReadingTextIdでテキストIDに一致する記録を取得できる", async () => {
    const records = await repository.findByReadingTextId(testReadingText.id);
    expect(records).toHaveLength(1);
    expect(records[0].id).toBe(testReadingRecord.id);
    expect(records[0].readingText.id).toBe(testReadingText.id);
  });

  test("saveで新しい記録を保存できる", async () => {
    const newRecord = ReadingRecord.create({
      id: "123e4567-e89b-12d3-a456-426614174002",
      readingText: testReadingText,
      audioUrl: "https://example.com/audio2.mp3",
      duration: 120,
      score: 90,
      createdAt: new Date("2024-03-25T00:00:00Z"),
      updatedAt: new Date("2024-03-25T00:00:00Z"),
    });

    await repository.save(newRecord);
    const record = await repository.findById(newRecord.id);
    expect(record).not.toBeNull();
    expect(record!.id).toBe(newRecord.id);
    expect(record!.readingText.id).toBe(testReadingText.id);
    expect(record!.audioUrl).toBe(newRecord.audioUrl);
    expect(record!.duration).toBe(newRecord.duration);
    expect(record!.score).toBe(newRecord.score);

    // クリーンアップ
    await supabase.from("reading_records").delete().eq("id", newRecord.id);
  });

  test("saveで既存の記録を更新できる", async () => {
    const updatedRecord = ReadingRecord.create({
      ...testReadingRecord,
      score: 95,
    });

    await repository.save(updatedRecord);
    const record = await repository.findById(testReadingRecord.id);
    expect(record).not.toBeNull();
    expect(record!.score).toBe(95);
  });

  test("deleteで記録を削除できる", async () => {
    await repository.delete(testReadingRecord.id);
    const record = await repository.findById(testReadingRecord.id);
    expect(record).toBeNull();
  });
}); 