'use client'

import React from 'react'
import { ReadingText } from '@/domain/entity/ReadingText/ReadingText'

interface ReadingTextListProps {
  texts: ReadingText[]
  onSelectText: (text: ReadingText) => void
}

export const ReadingTextList: React.FC<ReadingTextListProps> = ({ texts, onSelectText }) => {
  return (
    <div className="_space-y-4">
      <h2 className="_text-2xl _font-bold">練習テキスト一覧</h2>
      <div className="_grid _gap-4">
        {texts.map((text) => (
          <button
            key={text.id}
            onClick={() => onSelectText(text)}
            className="_p-4 _bg-white _rounded-lg _shadow _hover:shadow-md _transition-shadow"
          >
            <h3 className="_text-lg _font-semibold">{text.title}</h3>
            <p className="_text-gray-600">{text.content}</p>
          </button>
        ))}
      </div>
    </div>
  )
} 