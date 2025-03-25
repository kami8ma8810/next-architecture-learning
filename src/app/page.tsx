import React from 'react'
import { ReadingTextList } from '@/components/ReadingTextList'
import { ReadingRecorder } from '@/components/ReadingRecorder'
import { ReadingText } from '@/domain/entity/ReadingText/ReadingText'
import { readingTextRepository } from '@/infra/repository/Supabase/ReadingTextRepositoryImpl'
import { readingRecordRepository } from '@/infra/repository/Supabase/ReadingRecordRepositoryImpl'

export default async function Home() {
  const texts = await readingTextRepository.all()

  return (
    <main className="_container _mx-auto _px-4 _py-8">
      <h1 className="_text-3xl _font-bold _mb-8">音読練習</h1>
      <div className="_grid _grid-cols-1 _md:_grid-cols-2 _gap-8">
        <div>
          <h2 className="_text-xl _font-bold _mb-4">テキスト一覧</h2>
          <ReadingTextList texts={texts} onSelect={() => {}} />
        </div>
        <div>
          <h2 className="_text-xl _font-bold _mb-4">録音</h2>
          <ReadingRecorder
            text={texts[0]}
            onRecordComplete={async (audioUrl, duration) => {
              await readingRecordRepository.post(texts[0].id, audioUrl, duration, 0)
            }}
          />
        </div>
      </div>
    </main>
  )
} 