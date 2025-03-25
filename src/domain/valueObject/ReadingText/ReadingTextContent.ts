export type ReadingTextContent = string

export const $ReadingTextContent = {
  create: (content: string): Readonly<ReadingTextContent> => {
    if (!content) {
      throw new Error('ReadingTextContent cannot be empty')
    }
    if (content.length > 10000) {
      throw new Error('ReadingTextContent cannot be longer than 10000 characters')
    }
    return Object.freeze(content)
  },
} as const 