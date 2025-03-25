export type ReadingRecordId = string

export const $ReadingRecordId = {
  create: (id: string): Readonly<ReadingRecordId> => {
    if (!id) {
      throw new Error('ReadingRecordId cannot be empty')
    }
    return Object.freeze(id)
  },
} as const 