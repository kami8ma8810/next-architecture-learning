import { SupabaseClient } from "@supabase/supabase-js";
import { AudioFile, createAudioFile } from "../../../domain/entity/AudioFile/AudioFile";
import { AudioFileRepository } from "../../../domain/repository/AudioFileRepository/AudioFileRepository";
import { User } from "../../../domain/entity/User/User";

export interface UploadAudioParams {
  file: File;
  readingTextId: string;
  duration: number;
}

export class AudioUploadUseCase {
  constructor(
    private readonly supabase: SupabaseClient,
    private readonly audioFileRepository: AudioFileRepository
  ) {}

  async uploadAudio(params: UploadAudioParams, user: User): Promise<AudioFile> {
    const { file, readingTextId, duration } = params;

    // ファイルサイズの制限（10MB）
    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      throw new Error("ファイルサイズは10MB以下である必要があります");
    }

    // 音声ファイルのMIMEタイプチェック
    if (!file.type.startsWith("audio/")) {
      throw new Error("音声ファイルのみアップロード可能です");
    }

    // ファイル名をユニークにする
    const timestamp = new Date().getTime();
    const fileName = `${user.id}/${readingTextId}/${timestamp}-${file.name}`;

    // Supabase Storageにファイルをアップロード
    const { data: uploadData, error: uploadError } = await this.supabase.storage
      .from("audio-files")
      .upload(fileName, file);

    if (uploadError) {
      throw uploadError;
    }

    if (!uploadData) {
      throw new Error("ファイルのアップロードに失敗しました");
    }

    // 公開URLを取得
    const { data: { publicUrl } } = this.supabase.storage
      .from("audio-files")
      .getPublicUrl(fileName);

    // 音声ファイル情報を保存
    const audioFile = createAudioFile({
      id: crypto.randomUUID(),
      userId: user.id,
      readingTextId,
      filePath: fileName,
      duration,
      fileSize: file.size,
      mimeType: file.type,
    });

    await this.audioFileRepository.save(audioFile);

    return audioFile;
  }

  async deleteAudio(id: string, user: User): Promise<void> {
    const audioFile = await this.audioFileRepository.findById(id);
    if (!audioFile) {
      throw new Error("音声ファイルが見つかりません");
    }

    if (audioFile.userId !== user.id) {
      throw new Error("この音声ファイルを削除する権限がありません");
    }

    // Supabase Storageからファイルを削除
    const { error: storageError } = await this.supabase.storage
      .from("audio-files")
      .remove([audioFile.filePath]);

    if (storageError) {
      throw storageError;
    }

    // データベースから音声ファイル情報を削除
    await this.audioFileRepository.delete(id);
  }
} 