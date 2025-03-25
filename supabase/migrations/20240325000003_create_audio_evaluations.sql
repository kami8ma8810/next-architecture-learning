-- 音声ファイルの評価テーブルを作成
CREATE TABLE audio_evaluations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  audio_file_id UUID NOT NULL REFERENCES audio_files(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  feedback TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(audio_file_id, user_id)
);

-- インデックスを作成
CREATE INDEX audio_evaluations_audio_file_id_idx ON audio_evaluations(audio_file_id);
CREATE INDEX audio_evaluations_user_id_idx ON audio_evaluations(user_id);

-- updated_atを自動更新するトリガーを作成
CREATE TRIGGER set_audio_evaluations_updated_at
  BEFORE UPDATE ON audio_evaluations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column(); 