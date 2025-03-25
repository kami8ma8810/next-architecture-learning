-- ユーザープロフィールテーブル
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ユーザーの音読記録を紐付けるための外部キー制約を追加
ALTER TABLE reading_records
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- インデックスの作成
CREATE INDEX idx_reading_records_user_id ON reading_records(user_id);

-- updated_atを自動更新するトリガー
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column(); 