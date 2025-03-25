import { createClient } from '@supabase/supabase-js'
import { ReadingRecord } from '@/domain/entity/ReadingRecord/ReadingRecord'
import { ReadingRecordId } from '@/domain/valueObject/ReadingRecord/ReadingRecordId'
import { ReadingTextId } from '@/domain/valueObject/ReadingText/ReadingTextId'
import { ReadingRecordRepository } from '@/domain/repository/ReadingRecord/ReadingRecordRepository'
import { $ReadingRecord } from '@/domain/entity/ReadingRecord/ReadingRecord'
import { $ReadingRecordId } from '@/domain/valueObject/ReadingRecord/ReadingRecordId'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export const readingRecordRepository: ReadingRecordRepository = {
  all: async (): Promise<ReadingRecord[]> => {
    const { data, error } = await supabase.from('reading_records').select('*')
    if (error) throw error
    return data.map((row) => $ReadingRecord.create({
      id: $ReadingRecordId.create(row.id),
      readingTextId: row.reading_text_id,
      audioUrl: row.audio_url,
      duration: row.duration,
      score: row.score,
    }))
  },

  get: async (id: ReadingRecordId): Promise<ReadingRecord | undefined> => {
    const { data, error } = await supabase.from('reading_records').select('*').eq('id', id).single()
    if (error) throw error
    if (!data) return undefined
    return $ReadingRecord.create({
      id: $ReadingRecordId.create(data.id),
      readingTextId: data.reading_text_id,
      audioUrl: data.audio_url,
      duration: data.duration,
      score: data.score,
    })
  },

  post: async (readingTextId: ReadingTextId, audioUrl: string, duration: number, score: number): Promise<ReadingRecord> => {
    const { data, error } = await supabase
      .from('reading_records')
      .insert([{ reading_text_id: readingTextId, audio_url: audioUrl, duration, score }])
      .select()
      .single()
    if (error) throw error
    return $ReadingRecord.create({
      id: $ReadingRecordId.create(data.id),
      readingTextId: data.reading_text_id,
      audioUrl: data.audio_url,
      duration: data.duration,
      score: data.score,
    })
  },

  put: async (id: ReadingRecordId, value: ReadingRecord): Promise<ReadingRecord> => {
    const { data, error } = await supabase
      .from('reading_records')
      .update(value)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return $ReadingRecord.create({
      id: $ReadingRecordId.create(data.id),
      readingTextId: data.reading_text_id,
      audioUrl: data.audio_url,
      duration: data.duration,
      score: data.score,
    })
  },

  delete: async (id: ReadingRecordId): Promise<void> => {
    const { error } = await supabase.from('reading_records').delete().eq('id', id)
    if (error) throw error
  },
} 