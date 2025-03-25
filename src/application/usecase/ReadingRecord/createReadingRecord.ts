import { ReadingRecord } from '@/domain/entity/ReadingRecord/ReadingRecord'
import { ReadingRecordRepository } from '@/domain/repository/ReadingRecord/ReadingRecordRepository'
import { ReadingTextId } from '@/domain/valueObject/ReadingText/ReadingTextId'

export function createReadingRecord(
  repository: ReadingRecordRepository,
  readingTextId: ReadingTextId,
  audioUrl: string,
  duration: number,
  score: number
): Promise<ReadingRecord> {
  return repository.post(readingTextId, audioUrl, duration, score)
} 