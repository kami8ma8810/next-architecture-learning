import { SupabaseClient } from "@supabase/supabase-js";
import { AudioFileRepository } from "@/domain/repository/AudioFileRepository/AudioFileRepository";
import { User } from "@/domain/entity/User/User";

interface EvaluateAudioParams {
  audioFileId: string;
  score: number;
  feedback: string;
}

export class AudioEvaluationUseCase {
  constructor(
    private readonly supabase: SupabaseClient,
    private readonly audioFileRepository: AudioFileRepository
  ) {}

  async evaluateAudio(
    params: EvaluateAudioParams,
    user: User
  ): Promise<void> {
    const audioFile = await this.audioFileRepository.findById(params.audioFileId);
    if (!audioFile) {
      throw new Error("音声ファイルが見つかりません");
    }

    if (audioFile.userId !== user.id) {
      throw new Error("この音声ファイルを評価する権限がありません");
    }

    if (params.score < 0 || params.score > 100) {
      throw new Error("スコアは0から100の間である必要があります");
    }

    if (!params.feedback.trim()) {
      throw new Error("フィードバックを入力してください");
    }

    const { error } = await this.supabase.from("audio_evaluations").insert({
      audio_file_id: params.audioFileId,
      user_id: user.id,
      score: params.score,
      feedback: params.feedback,
    });

    if (error) {
      throw new Error("評価の保存に失敗しました");
    }
  }
} 