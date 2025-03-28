'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ReadingText } from '@/domain/entity/ReadingText/ReadingText'

interface ReadingRecorderProps {
  text: ReadingText
  onRecordingComplete: (audioBlob: Blob) => void
  onBack: () => void
}

export const ReadingRecorder: React.FC<ReadingRecorderProps> = ({ text, onRecordingComplete, onBack }) => {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // 録音時間の更新
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isRecording])

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []
      setRecordingTime(0)
      setAudioUrl(null)

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' })
        const url = URL.createObjectURL(audioBlob)
        setAudioUrl(url)
        onRecordingComplete(audioBlob)
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error('録音の開始に失敗しました:', error)
      alert('マイクへのアクセスが拒否されたか、エラーが発生しました。')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const handleBack = () => {
    if (isRecording) {
      if (confirm('録音を中止して一覧に戻りますか？')) {
        stopRecording()
        onBack()
      }
    } else {
      onBack()
    }
  }

  return (
    <div className="_space-y-4">
      <div className="_flex _items-center _justify-between">
        <h2 className="_text-2xl _font-bold">音声録音</h2>
        <button
          onClick={handleBack}
          className="_px-4 _py-2 _text-gray-600 hover:_text-gray-800 _flex _items-center _gap-2"
        >
          <svg className="_w-5 _h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          一覧に戻る
        </button>
      </div>
      <div className="_p-4 _bg-white _rounded-lg _shadow">
        <h3 className="_text-lg _font-semibold">{text.title}</h3>
        <p className="_text-gray-600 _mb-4">{text.content}</p>
        
        <div className="_flex _flex-col _items-center _gap-4">
          {/* 録音状態とタイマー */}
          <div className="_flex _items-center _gap-4">
            {isRecording && (
              <div className="_flex _items-center _gap-2">
                <div className="_w-3 _h-3 _bg-red-500 _rounded-full _animate-pulse" />
                <span className="_text-red-500">録音中</span>
              </div>
            )}
            <span className="_text-lg _font-mono">{formatTime(recordingTime)}</span>
          </div>

          {/* 録音ボタン */}
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`_px-6 _py-3 _rounded-full _font-semibold _transition-all _transform hover:_scale-105 ${
              isRecording
                ? '_bg-red-500 hover:_bg-red-600 _text-white'
                : '_bg-blue-500 hover:_bg-blue-600 _text-white'
            }`}
          >
            {isRecording ? '録音を停止' : '録音を開始'}
          </button>

          {/* 音声プレビュー */}
          {audioUrl && (
            <div className="_w-full _max-w-md">
              <p className="_text-sm _text-gray-600 _mb-2">録音プレビュー:</p>
              <audio controls className="_w-full" src={audioUrl}>
                お使いのブラウザは音声の再生をサポートしていません。
              </audio>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 