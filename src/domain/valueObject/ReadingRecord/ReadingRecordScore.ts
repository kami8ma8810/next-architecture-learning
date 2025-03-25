export type ReadingRecordScore = number

export const $ReadingRecordScore = {
  create: (score: number): Readonly<ReadingRecordScore> => {
    if (score < 0) {
      throw new Error('ReadingRecordScore cannot be negative')
    }
    if (score > 100) {
      throw new Error('ReadingRecordScore cannot be greater than 100')
    }
    return Object.freeze(score)
  },
} as const 