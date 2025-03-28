'use client'

import React, { useState, useEffect } from 'react'
import { ReadingTextList } from '@/components/ReadingTextList/ReadingTextList'
import { ReadingRecorder } from '@/components/ReadingRecorder/ReadingRecorder'
import { readingTextRepository } from '@/infra/repository/Supabase/ReadingTextRepositoryImpl'
import { ReadingText } from '@/domain/entity/ReadingText/ReadingText'

export default function Home() {
  const [texts, setTexts] = useState<ReadingText[]>([])
  const [selectedText, setSelectedText] = useState<ReadingText | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTexts = async () => {
      try {
        const fetchedTexts = await readingTextRepository.findAll()
        setTexts(fetchedTexts)
      } catch (err) {
        setError('読み上げテキストの取得に失敗しました')
        console.error(err)
      }
    }

    fetchTexts()
  }, [])

  const handleSelectText = (text: ReadingText) => {
    setSelectedText(text)
  }

  const handleBack = () => {
    setSelectedText(null)
  }

  const handleRecordingComplete = (audioBlob: Blob) => {
    // TODO: 音声ファイルのアップロード処理を実装
    console.log('録音が完了しました:', audioBlob)
  }

  if (error) {
    return <div className="_text-red-500">{error}</div>
  }

  return (
    <main className="_container _mx-auto _px-4 _py-8">
      <h1 className="_text-3xl _font-bold _mb-8">音声学習アプリ</h1>
      {selectedText ? (
        <ReadingRecorder
          text={selectedText}
          onRecordingComplete={handleRecordingComplete}
          onBack={handleBack}
        />
      ) : (
        <ReadingTextList
          texts={texts}
          onSelectText={handleSelectText}
        />
      )}
    </main>
  )
} 