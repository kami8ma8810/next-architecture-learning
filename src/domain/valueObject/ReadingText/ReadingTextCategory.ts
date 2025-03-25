export type ReadingTextCategory = 'STORY' | 'NEWS' | 'POEM' | 'ESSAY' | 'DIALOGUE'

export const $ReadingTextCategory = {
  create: (category: ReadingTextCategory): Readonly<ReadingTextCategory> => {
    if (!['STORY', 'NEWS', 'POEM', 'ESSAY', 'DIALOGUE'].includes(category)) {
      throw new Error('Invalid ReadingTextCategory')
    }
    return Object.freeze(category)
  },
} as const 