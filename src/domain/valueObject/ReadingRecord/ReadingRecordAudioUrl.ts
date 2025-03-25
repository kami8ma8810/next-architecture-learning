export type ReadingRecordAudioUrl = string

export const $ReadingRecordAudioUrl = {
  create: (url: string): Readonly<ReadingRecordAudioUrl> => {
    if (!url) {
      throw new Error('ReadingRecordAudioUrl cannot be empty')
    }
    if (!url.startsWith('https://')) {
      throw new Error('ReadingRecordAudioUrl must be a valid HTTPS URL')
    }
    return Object.freeze(url)
  },
} as const 