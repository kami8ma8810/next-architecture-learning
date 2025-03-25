import { createClient } from '@supabase/supabase-js'
import { ReadingText } from '@/domain/entity/ReadingText/ReadingText'
import { ReadingTextId } from '@/domain/valueObject/ReadingText/ReadingTextId'
import { ReadingTextDifficulty } from '@/domain/valueObject/ReadingText/ReadingTextDifficulty'
import { ReadingTextCategory } from '@/domain/valueObject/ReadingText/ReadingTextCategory'
import { ReadingTextRepository } from '@/domain/repository/ReadingText/ReadingTextRepository'
import { $ReadingText } from '@/domain/entity/ReadingText/ReadingText'
import { $ReadingTextId } from '@/domain/valueObject/ReadingText/ReadingTextId'
import { $ReadingTextDifficulty } from '@/domain/valueObject/ReadingText/ReadingTextDifficulty'
import { $ReadingTextCategory } from '@/domain/valueObject/ReadingText/ReadingTextCategory'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export const readingTextRepository: ReadingTextRepository = {
  all: async (): Promise<ReadingText[]> => {
    const { data, error } = await supabase.from('reading_texts').select('*')
    if (error) throw error
    return data.map((row) => $ReadingText.create({
      id: $ReadingTextId.create(row.id),
      content: row.content,
      difficulty: $ReadingTextDifficulty.create(row.difficulty),
      category: $ReadingTextCategory.create(row.category),
    }))
  },

  get: async (id: ReadingTextId): Promise<ReadingText | undefined> => {
    const { data, error } = await supabase.from('reading_texts').select('*').eq('id', id).single()
    if (error) throw error
    if (!data) return undefined
    return $ReadingText.create({
      id: $ReadingTextId.create(data.id),
      content: data.content,
      difficulty: $ReadingTextDifficulty.create(data.difficulty),
      category: $ReadingTextCategory.create(data.category),
    })
  },

  post: async (content: string, difficulty: ReadingTextDifficulty, category: ReadingTextCategory): Promise<ReadingText> => {
    const { data, error } = await supabase
      .from('reading_texts')
      .insert([{ content, difficulty, category }])
      .select()
      .single()
    if (error) throw error
    return $ReadingText.create({
      id: $ReadingTextId.create(data.id),
      content: data.content,
      difficulty: $ReadingTextDifficulty.create(data.difficulty),
      category: $ReadingTextCategory.create(data.category),
    })
  },

  put: async (id: ReadingTextId, value: ReadingText): Promise<ReadingText> => {
    const { data, error } = await supabase
      .from('reading_texts')
      .update(value)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return $ReadingText.create({
      id: $ReadingTextId.create(data.id),
      content: data.content,
      difficulty: $ReadingTextDifficulty.create(data.difficulty),
      category: $ReadingTextCategory.create(data.category),
    })
  },

  delete: async (id: ReadingTextId): Promise<void> => {
    const { error } = await supabase.from('reading_texts').delete().eq('id', id)
    if (error) throw error
  },
} 