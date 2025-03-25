import { SupabaseClient } from "@supabase/supabase-js";
import { AudioFileRepository } from "../../../domain/repository/AudioFileRepository/AudioFileRepository";
import { AudioFile, createAudioFile } from "../../../domain/entity/AudioFile/AudioFile";

export class AudioFileRepositoryImpl implements AudioFileRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async findById(id: string): Promise<AudioFile | null> {
    const { data, error } = await this.supabase
      .from("audio_files")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      return null;
    }

    return createAudioFile({
      id: data.id,
      userId: data.user_id,
      readingTextId: data.reading_text_id,
      filePath: data.file_path,
      duration: data.duration,
      fileSize: data.file_size,
      mimeType: data.mime_type,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    });
  }

  async findByUserId(userId: string): Promise<AudioFile[]> {
    const { data, error } = await this.supabase
      .from("audio_files")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      throw error;
    }

    return data.map((item) =>
      createAudioFile({
        id: item.id,
        userId: item.user_id,
        readingTextId: item.reading_text_id,
        filePath: item.file_path,
        duration: item.duration,
        fileSize: item.file_size,
        mimeType: item.mime_type,
        createdAt: new Date(item.created_at),
        updatedAt: new Date(item.updated_at),
      })
    );
  }

  async findByReadingTextId(readingTextId: string): Promise<AudioFile[]> {
    const { data, error } = await this.supabase
      .from("audio_files")
      .select("*")
      .eq("reading_text_id", readingTextId);

    if (error) {
      throw error;
    }

    return data.map((item) =>
      createAudioFile({
        id: item.id,
        userId: item.user_id,
        readingTextId: item.reading_text_id,
        filePath: item.file_path,
        duration: item.duration,
        fileSize: item.file_size,
        mimeType: item.mime_type,
        createdAt: new Date(item.created_at),
        updatedAt: new Date(item.updated_at),
      })
    );
  }

  async save(audioFile: AudioFile): Promise<void> {
    const { error } = await this.supabase.from("audio_files").upsert({
      id: audioFile.id,
      user_id: audioFile.userId,
      reading_text_id: audioFile.readingTextId,
      file_path: audioFile.filePath,
      duration: audioFile.duration,
      file_size: audioFile.fileSize,
      mime_type: audioFile.mimeType,
      created_at: audioFile.createdAt.toISOString(),
      updated_at: audioFile.updatedAt.toISOString(),
    });

    if (error) {
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from("audio_files")
      .delete()
      .eq("id", id);

    if (error) {
      throw error;
    }
  }
} 