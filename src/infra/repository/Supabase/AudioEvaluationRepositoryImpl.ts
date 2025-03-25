import { SupabaseClient } from "@supabase/supabase-js";
import { AudioEvaluationRepository } from "@/domain/repository/AudioEvaluationRepository/AudioEvaluationRepository";
import { AudioEvaluation } from "@/domain/entity/AudioEvaluation/AudioEvaluation";

export class AudioEvaluationRepositoryImpl implements AudioEvaluationRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async findById(id: string): Promise<AudioEvaluation | null> {
    const { data, error } = await this.supabase
      .from("audio_evaluations")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw new Error("評価の取得に失敗しました");
    }

    if (!data) {
      return null;
    }

    return {
      id: data.id,
      audioFileId: data.audio_file_id,
      userId: data.user_id,
      score: data.score,
      feedback: data.feedback,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }

  async findByAudioFileId(audioFileId: string): Promise<AudioEvaluation[]> {
    const { data, error } = await this.supabase
      .from("audio_evaluations")
      .select("*")
      .eq("audio_file_id", audioFileId);

    if (error) {
      throw new Error("評価の取得に失敗しました");
    }

    return data.map((item) => ({
      id: item.id,
      audioFileId: item.audio_file_id,
      userId: item.user_id,
      score: item.score,
      feedback: item.feedback,
      createdAt: new Date(item.created_at),
      updatedAt: new Date(item.updated_at),
    }));
  }

  async findByUserId(userId: string): Promise<AudioEvaluation[]> {
    const { data, error } = await this.supabase
      .from("audio_evaluations")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      throw new Error("評価の取得に失敗しました");
    }

    return data.map((item) => ({
      id: item.id,
      audioFileId: item.audio_file_id,
      userId: item.user_id,
      score: item.score,
      feedback: item.feedback,
      createdAt: new Date(item.created_at),
      updatedAt: new Date(item.updated_at),
    }));
  }

  async save(audioEvaluation: AudioEvaluation): Promise<void> {
    const { error } = await this.supabase
      .from("audio_evaluations")
      .upsert({
        id: audioEvaluation.id,
        audio_file_id: audioEvaluation.audioFileId,
        user_id: audioEvaluation.userId,
        score: audioEvaluation.score,
        feedback: audioEvaluation.feedback,
        created_at: audioEvaluation.createdAt.toISOString(),
        updated_at: audioEvaluation.updatedAt.toISOString(),
      });

    if (error) {
      throw new Error("評価の保存に失敗しました");
    }
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from("audio_evaluations")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error("評価の削除に失敗しました");
    }
  }
} 