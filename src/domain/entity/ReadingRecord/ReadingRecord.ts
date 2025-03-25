import { ReadingRecordId } from '@/domain/valueObject/ReadingRecord/ReadingRecordId'
import { ReadingTextId } from '@/domain/valueObject/ReadingText/ReadingTextId'
import { ReadingRecordAudioUrl } from '@/domain/valueObject/ReadingRecord/ReadingRecordAudioUrl'
import { ReadingRecordDuration } from '@/domain/valueObject/ReadingRecord/ReadingRecordDuration'
import { ReadingRecordScore } from '@/domain/valueObject/ReadingRecord/ReadingRecordScore'

export interface ReadingRecord {
  id: ReadingRecordId
  readingTextId: ReadingTextId
  audioUrl: ReadingRecordAudioUrl
  duration: ReadingRecordDuration
  score: ReadingRecordScore
  createdAt: Date
  updatedAt: Date
}

export const $ReadingRecord = {
  create: (params: {
    id: ReadingRecordId
    readingTextId: ReadingTextId
    audioUrl: ReadingRecordAudioUrl
    duration: ReadingRecordDuration
    score: ReadingRecordScore
  }): Readonly<ReadingRecord> => {
    const now = new Date()
    return Object.freeze({
      id: params.id,
      readingTextId: params.readingTextId,
      audioUrl: params.audioUrl,
      duration: params.duration,
      score: params.score,
      createdAt: now,
      updatedAt: now,
    })
  },
} as const 