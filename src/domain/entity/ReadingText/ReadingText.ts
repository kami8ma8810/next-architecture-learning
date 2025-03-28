import { ReadingTextId } from '@/domain/valueObject/ReadingText/ReadingTextId'
import { ReadingTextContent } from '@/domain/valueObject/ReadingText/ReadingTextContent'
import { ReadingTextDifficulty } from '@/domain/valueObject/ReadingText/ReadingTextDifficulty'
import { ReadingTextCategory } from '@/domain/valueObject/ReadingText/ReadingTextCategory'

export interface ReadingText {
  id: string
  title: string
  content: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  category: 'daily' | 'business' | 'academic'
  createdAt: Date
  updatedAt: Date
}

export const createReadingText = (params: Omit<ReadingText, 'id' | 'createdAt' | 'updatedAt'>): ReadingText => {
  if (!params.title.trim()) {
    throw new Error('タイトルは必須です')
  }
  if (!params.content.trim()) {
    throw new Error('内容は必須です')
  }

  return {
    ...params,
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

export const $ReadingText = {
  create: (params: Omit<ReadingText, 'id' | 'createdAt' | 'updatedAt'>): Readonly<ReadingText> => {
    return Object.freeze(createReadingText(params))
  },
} as const 