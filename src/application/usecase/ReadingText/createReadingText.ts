import { ReadingText } from '@/domain/entity/ReadingText/ReadingText'
import { ReadingTextRepository } from '@/domain/repository/ReadingText/ReadingTextRepository'
import { ReadingTextDifficulty } from '@/domain/valueObject/ReadingText/ReadingTextDifficulty'
import { ReadingTextCategory } from '@/domain/valueObject/ReadingText/ReadingTextCategory'

export function createReadingText(
  repository: ReadingTextRepository,
  content: string,
  difficulty: ReadingTextDifficulty,
  category: ReadingTextCategory
): Promise<ReadingText> {
  return repository.post(content, difficulty, category)
} 