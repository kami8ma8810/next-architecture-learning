import { ReadingRecord } from '@/domain/entity/ReadingRecord/ReadingRecord'
import { ReadingRecordId } from '@/domain/valueObject/ReadingRecord/ReadingRecordId'
import { ReadingTextId } from '@/domain/valueObject/ReadingText/ReadingTextId'
import { AllRepository, GetRepository, PostRepository, PutRepository, DeleteRepository } from '@/domain/repository/RestRepository'

export type ReadingRecordRepository = AllRepository<ReadingRecord> &
  GetRepository<ReadingRecord, ReadingRecordId> &
  PostRepository<ReadingRecord, [ReadingTextId, string, number, number]> &
  PutRepository<ReadingRecord, ReadingRecordId> &
  DeleteRepository<ReadingRecordId> 