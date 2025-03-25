export type ReadingRecordDuration = number

export const $ReadingRecordDuration = {
  create: (duration: number): Readonly<ReadingRecordDuration> => {
    if (duration < 0) {
      throw new Error('ReadingRecordDuration cannot be negative')
    }
    if (duration > 3600) {
      throw new Error('ReadingRecordDuration cannot be longer than 1 hour')
    }
    return Object.freeze(duration)
  },
} as const 