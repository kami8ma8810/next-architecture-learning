import { describe, expect, test } from "bun:test";
import { ReadingRecordRepository } from "../ReadingRecordRepository";
import { ReadingRecord } from "../../../entity/ReadingRecord/ReadingRecord";
import { ReadingText } from "../../../entity/ReadingText/ReadingText";
import { Difficulty, Category } from "../../../entity/ReadingText/types";

describe("ReadingRecordRepository", () => {
  const mockReadingText = ReadingText.create({
    id: "123e4567-e89b-12d3-a456-426614174000",
    content: "テストテキスト",
    difficulty: "BEGINNER" as Difficulty,
    category: "STORY" as Category,
    createdAt: new Date("2024-03-25T00:00:00Z"),
    updatedAt: new Date("2024-03-25T00:00:00Z"),
  });

  const mockReadingRecord = ReadingRecord.create({
    id: "123e4567-e89b-12d3-a456-426614174001",
    readingText: mockReadingText,
    audioUrl: "https://example.com/audio.mp3",
    duration: 60,
    score: 85,
    createdAt: new Date("2024-03-25T00:00:00Z"),
    updatedAt: new Date("2024-03-25T00:00:00Z"),
  });

  class MockReadingRecordRepository implements ReadingRecordRepository {
    private records: ReadingRecord[] = [mockReadingRecord];

    async findAll(): Promise<ReadingRecord[]> {
      return this.records;
    }

    async findById(id: string): Promise<ReadingRecord | null> {
      return this.records.find((record) => record.id === id) || null;
    }

    async findByReadingTextId(readingTextId: string): Promise<ReadingRecord[]> {
      return this.records.filter((record) => record.readingText.id === readingTextId);
    }

    async save(record: ReadingRecord): Promise<void> {
      const index = this.records.findIndex((r) => r.id === record.id);
      if (index === -1) {
        this.records.push(record);
      } else {
        this.records[index] = record;
      }
    }

    async delete(id: string): Promise<void> {
      this.records = this.records.filter((record) => record.id !== id);
    }
  }

  const repository = new MockReadingRecordRepository();

  test("findAllで全ての記録を取得できる", async () => {
    const records = await repository.findAll();
    expect(records).toHaveLength(1);
    expect(records[0]).toEqual(mockReadingRecord);
  });

  test("findByIdで存在する記録を取得できる", async () => {
    const record = await repository.findById(mockReadingRecord.id);
    expect(record).toEqual(mockReadingRecord);
  });

  test("findByIdで存在しない記録はnullを返す", async () => {
    const record = await repository.findById("non-existent-id");
    expect(record).toBeNull();
  });

  test("findByReadingTextIdでテキストIDに一致する記録を取得できる", async () => {
    const records = await repository.findByReadingTextId(mockReadingText.id);
    expect(records).toHaveLength(1);
    expect(records[0]).toEqual(mockReadingRecord);
  });

  test("saveで新しい記録を保存できる", async () => {
    const newRecord = ReadingRecord.create({
      id: "123e4567-e89b-12d3-a456-426614174002",
      readingText: mockReadingText,
      audioUrl: "https://example.com/audio2.mp3",
      duration: 120,
      score: 90,
      createdAt: new Date("2024-03-25T00:00:00Z"),
      updatedAt: new Date("2024-03-25T00:00:00Z"),
    });

    await repository.save(newRecord);
    const records = await repository.findAll();
    expect(records).toHaveLength(2);
    expect(records[1]).toEqual(newRecord);
  });

  test("saveで既存の記録を更新できる", async () => {
    const updatedRecord = ReadingRecord.create({
      ...mockReadingRecord,
      score: 95,
    });

    await repository.save(updatedRecord);
    const record = await repository.findById(mockReadingRecord.id);
    expect(record).toEqual(updatedRecord);
  });

  test("deleteで記録を削除できる", async () => {
    await repository.delete(mockReadingRecord.id);
    const records = await repository.findAll();
    expect(records).toHaveLength(0);
  });
}); 