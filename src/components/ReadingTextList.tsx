import React from 'react'
import { ReadingText } from '@/domain/entity/ReadingText/ReadingText'
import { ReadingTextDifficulty } from '@/domain/valueObject/ReadingText/ReadingTextDifficulty'
import { ReadingTextCategory } from '@/domain/valueObject/ReadingText/ReadingTextCategory'

interface ReadingTextListProps {
  texts: ReadingText[]
  onSelect: (text: ReadingText) => void
}

const difficultyColors: Record<ReadingTextDifficulty, string> = {
  BEGINNER: '_bg-green-100 _text-green-800',
  INTERMEDIATE: '_bg-yellow-100 _text-yellow-800',
  ADVANCED: '_bg-red-100 _text-red-800',
}

const categoryLabels: Record<ReadingTextCategory, string> = {
  STORY: '物語',
  NEWS: 'ニュース',
  POEM: '詩',
  ESSAY: 'エッセイ',
  DIALOGUE: '対話',
}

export function ReadingTextList({ texts, onSelect }: ReadingTextListProps) {
  return (
    <div className="_space-y-4">
      {texts.map((text) => (
        <div
          key={text.id}
          className="_p-4 _bg-white _rounded-lg _shadow _hover:_shadow-md _transition-shadow _cursor-pointer"
          onClick={() => onSelect(text)}
        >
          <div className="_flex _justify-between _items-start">
            <div className="_space-y-2">
              <p className="_text-lg _font-medium">{text.content.substring(0, 100)}...</p>
              <div className="_flex _space-x-2">
                <span className={`_px-2 _py-1 _rounded-full _text-sm ${difficultyColors[text.difficulty]}`}>
                  {text.difficulty}
                </span>
                <span className="_px-2 _py-1 _rounded-full _text-sm _bg-blue-100 _text-blue-800">
                  {categoryLabels[text.category]}
                </span>
              </div>
            </div>
            <span className="_text-sm _text-gray-500">
              {new Date(text.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
} 