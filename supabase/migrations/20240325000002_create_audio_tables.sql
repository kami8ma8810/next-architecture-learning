-- 音声ファイルテーブル
CREATE TABLE audio_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reading_text_id UUID NOT NULL REFERENCES reading_texts(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  duration INTEGER NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- インデックスの作成
CREATE INDEX idx_audio_files_user_id ON audio_files(user_id);
CREATE INDEX idx_audio_files_reading_text_id ON audio_files(reading_text_id);

-- updated_atを自動更新するトリガー
CREATE TRIGGER update_audio_files_updated_at
  BEFORE UPDATE ON audio_files
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column(); 