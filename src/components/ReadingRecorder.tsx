import React, { useState, useRef } from 'react'
import { ReadingText } from '@/domain/entity/ReadingText/ReadingText'

interface ReadingRecorderProps {
  text: ReadingText
  onRecordComplete: (audioUrl: string, duration: number) => void
}

export function ReadingRecorder({ text, onRecordComplete }: ReadingRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [duration, setDuration] = useState(0)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const audioUrl = URL.createObjectURL(blob)
        onRecordComplete(audioUrl, duration)
        stream.getTracks().forEach(track => track.stop())
        setIsRecording(false)
        setDuration(0)
      }

      mediaRecorder.start()
      setIsRecording(true)

      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1)
      }, 1000)
    } catch (error) {
      console.error('Error accessing microphone:', error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="_space-y-4">
      <div className="_p-4 _bg-white _rounded-lg _shadow">
        <h2 className="_text-xl _font-bold _mb-4">音読テキスト</h2>
        <p className="_text-lg _whitespace-pre-wrap">{text.content}</p>
      </div>

      <div className="_flex _items-center _justify-center _space-x-4">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`_px-6 _py-3 _rounded-full _font-medium _transition-colors ${
            isRecording
              ? '_bg-red-500 _hover:_bg-red-600 _text-white'
              : '_bg-blue-500 _hover:_bg-blue-600 _text-white'
          }`}
        >
          {isRecording ? '録音を停止' : '録音を開始'}
        </button>
        <span className="_text-lg _font-medium">
          {formatDuration(duration)}
        </span>
      </div>
    </div>
  )
} 