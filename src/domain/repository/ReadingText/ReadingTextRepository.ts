import { ReadingText } from '@/domain/entity/ReadingText/ReadingText'
import { ReadingTextId } from '@/domain/valueObject/ReadingText/ReadingTextId'
import { ReadingTextDifficulty } from '@/domain/valueObject/ReadingText/ReadingTextDifficulty'
import { ReadingTextCategory } from '@/domain/valueObject/ReadingText/ReadingTextCategory'
import { AllRepository, GetRepository, PostRepository, PutRepository, DeleteRepository } from '@/domain/repository/RestRepository'

export type ReadingTextRepository = AllRepository<ReadingText> &
  GetRepository<ReadingText, ReadingTextId> &
  PostRepository<ReadingText, [string, ReadingTextDifficulty, ReadingTextCategory]> &
  PutRepository<ReadingText, ReadingTextId> &
  DeleteRepository<ReadingTextId> 