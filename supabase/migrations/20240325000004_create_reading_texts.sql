-- 読み上げテキストテーブルの作成
CREATE TABLE reading_texts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  category TEXT NOT NULL CHECK (category IN ('daily', 'business', 'academic')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- インデックスの作成
CREATE INDEX idx_reading_texts_difficulty ON reading_texts(difficulty);
CREATE INDEX idx_reading_texts_category ON reading_texts(category);

-- 更新日時の自動更新トリガー
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON reading_texts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- サンプルデータの挿入
INSERT INTO reading_texts (title, content, difficulty, category) VALUES
  ('日常会話 - 挨拶', 'こんにちは。今日はいい天気ですね。最近、新しい趣味を始めました。', 'beginner', 'daily'),
  ('ビジネス - プレゼンテーション', '本日は、新商品の開発についてご説明させていただきます。市場調査の結果、以下のような特徴が明らかになりました。', 'intermediate', 'business'),
  ('学術 - 環境問題', '地球温暖化は、人類が直面する最も重要な課題の一つです。温室効果ガスの排出量を削減し、持続可能な社会を構築することが求められています。', 'advanced', 'academic'); 