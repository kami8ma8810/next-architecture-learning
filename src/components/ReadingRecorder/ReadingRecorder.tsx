import React, { useState, useRef } from 'react'
import { ReadingText } from '@/domain/entity/ReadingText/ReadingText'

interface ReadingRecorderProps {
  text: ReadingText
  onRecordingComplete: (audioBlob: Blob) => void
}

export const ReadingRecorder: React.FC<ReadingRecorderProps> = ({ text, onRecordingComplete }) => {
  const [isRecording, setIsRecording] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

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
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' })
        onRecordingComplete(audioBlob)
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error('録音の開始に失敗しました:', error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  return (
    <div className="_space-y-4">
      <h2 className="_text-2xl _font-bold">音声録音</h2>
      <div className="_p-4 _bg-white _rounded-lg _shadow">
        <h3 className="_text-lg _font-semibold">{text.title}</h3>
        <p className="_text-gray-600">{text.content}</p>
      </div>
      <div className="_flex _gap-4">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`_px-4 _py-2 _rounded-lg _font-semibold _transition-colors ${
            isRecording
              ? '_bg-red-500 _hover:bg-red-600 _text-white'
              : '_bg-blue-500 _hover:bg-blue-600 _text-white'
          }`}
        >
          {isRecording ? '録音を停止' : '録音を開始'}
        </button>
      </div>
    </div>
  )
} 