export type ReadingTextDifficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'

export const $ReadingTextDifficulty = {
  create: (difficulty: ReadingTextDifficulty): Readonly<ReadingTextDifficulty> => {
    if (!['BEGINNER', 'INTERMEDIATE', 'ADVANCED'].includes(difficulty)) {
      throw new Error('Invalid ReadingTextDifficulty')
    }
    return Object.freeze(difficulty)
  },
} as const 