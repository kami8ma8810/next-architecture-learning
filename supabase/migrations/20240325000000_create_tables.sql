-- 音読テキストテーブル
CREATE TABLE reading_texts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED')),
  category TEXT NOT NULL CHECK (category IN ('STORY', 'NEWS', 'POEM', 'ESSAY', 'DIALOGUE')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 音読記録テーブル
CREATE TABLE reading_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reading_text_id UUID NOT NULL REFERENCES reading_texts(id) ON DELETE CASCADE,
  audio_url TEXT NOT NULL,
  duration INTEGER NOT NULL CHECK (duration >= 0 AND duration <= 3600),
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- インデックスの作成
CREATE INDEX idx_reading_texts_difficulty ON reading_texts(difficulty);
CREATE INDEX idx_reading_texts_category ON reading_texts(category);
CREATE INDEX idx_reading_records_reading_text_id ON reading_records(reading_text_id);

-- updated_atを自動更新するトリガー
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_reading_texts_updated_at
  BEFORE UPDATE ON reading_texts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reading_records_updated_at
  BEFORE UPDATE ON reading_records
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column(); 