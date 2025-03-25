import { AudioFile } from "../../entity/AudioFile/AudioFile";

export interface AudioFileRepository {
  findById(id: string): Promise<AudioFile | null>;
  findByUserId(userId: string): Promise<AudioFile[]>;
  findByReadingTextId(readingTextId: string): Promise<AudioFile[]>;
  save(audioFile: AudioFile): Promise<void>;
  delete(id: string): Promise<void>;
} 