import { ReadingTextId } from '@/domain/valueObject/ReadingText/ReadingTextId'
import { ReadingTextContent } from '@/domain/valueObject/ReadingText/ReadingTextContent'
import { ReadingTextDifficulty } from '@/domain/valueObject/ReadingText/ReadingTextDifficulty'
import { ReadingTextCategory } from '@/domain/valueObject/ReadingText/ReadingTextCategory'

export interface ReadingText {
  id: ReadingTextId
  content: ReadingTextContent
  difficulty: ReadingTextDifficulty
  category: ReadingTextCategory
  createdAt: Date
  updatedAt: Date
}

export const $ReadingText = {
  create: (params: {
    id: ReadingTextId
    content: ReadingTextContent
    difficulty: ReadingTextDifficulty
    category: ReadingTextCategory
  }): Readonly<ReadingText> => {
    const now = new Date()
    return Object.freeze({
      id: params.id,
      content: params.content,
      difficulty: params.difficulty,
      category: params.category,
      createdAt: now,
      updatedAt: now,
    })
  },
} as const 