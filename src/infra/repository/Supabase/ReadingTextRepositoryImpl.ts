import { SupabaseClient } from '@supabase/supabase-js'
import { ReadingText, $ReadingText } from '@/domain/entity/ReadingText/ReadingText'
import { ReadingTextId } from '@/domain/valueObject/ReadingText/ReadingTextId'
import { ReadingTextDifficulty } from '@/domain/valueObject/ReadingText/ReadingTextDifficulty'
import { ReadingTextCategory } from '@/domain/valueObject/ReadingText/ReadingTextCategory'
import { ReadingTextRepository } from '@/domain/repository/ReadingText/ReadingTextRepository'
import { $ReadingTextId } from '@/domain/valueObject/ReadingText/ReadingTextId'
import { $ReadingTextDifficulty } from '@/domain/valueObject/ReadingText/ReadingTextDifficulty'
import { $ReadingTextCategory } from '@/domain/valueObject/ReadingText/ReadingTextCategory'

export const readingTextRepository: ReadingTextRepository = {
  async findAll(): Promise<ReadingText[]> {
    const supabase = new SupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data, error } = await supabase
      .from('reading_texts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error('読み上げテキストの取得に失敗しました')
    }

    return data.map((item) => $ReadingText.create({
      title: item.title,
      content: item.content,
      difficulty: item.difficulty,
      category: item.category,
    }))
  },

  async findById(id: string): Promise<ReadingText | null> {
    const supabase = new SupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data, error } = await supabase
      .from('reading_texts')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      throw new Error('読み上げテキストの取得に失敗しました')
    }

    if (!data) {
      return null
    }

    return $ReadingText.create({
      title: data.title,
      content: data.content,
      difficulty: data.difficulty,
      category: data.category,
    })
  },

  async save(text: ReadingText): Promise<void> {
    const supabase = new SupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { error } = await supabase
      .from('reading_texts')
      .upsert({
        id: text.id,
        title: text.title,
        content: text.content,
        difficulty: text.difficulty,
        category: text.category,
        created_at: text.createdAt.toISOString(),
        updated_at: text.updatedAt.toISOString(),
      })

    if (error) {
      throw new Error('読み上げテキストの保存に失敗しました')
    }
  },

  async delete(id: string): Promise<void> {
    const supabase = new SupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { error } = await supabase
      .from('reading_texts')
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error('読み上げテキストの削除に失敗しました')
    }
  },
} 