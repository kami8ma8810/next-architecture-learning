export type ReadingTextId = string

export const $ReadingTextId = {
  create: (id: string): Readonly<ReadingTextId> => {
    if (!id) {
      throw new Error('ReadingTextId cannot be empty')
    }
    return Object.freeze(id)
  },
} as const 