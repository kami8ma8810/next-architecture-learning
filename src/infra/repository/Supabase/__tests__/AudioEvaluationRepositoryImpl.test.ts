import { describe, expect, test, vi, beforeEach } from "bun:test";
import { SupabaseClient } from "@supabase/supabase-js";
import { AudioEvaluationRepositoryImpl } from "../AudioEvaluationRepositoryImpl";
import { createAudioEvaluation } from "../../../../domain/entity/AudioEvaluation/AudioEvaluation";

describe("AudioEvaluationRepositoryImpl", () => {
  let supabase: SupabaseClient;
  let audioEvaluationRepository: AudioEvaluationRepositoryImpl;

  beforeEach(() => {
    supabase = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn(),
        upsert: vi.fn(),
        delete: vi.fn(),
      }),
    } as unknown as SupabaseClient;

    audioEvaluationRepository = new AudioEvaluationRepositoryImpl(supabase);
  });

  describe("findById", () => {
    test("評価を取得できる", async () => {
      const mockData = {
        id: "test-id",
        audio_file_id: "test-audio-id",
        user_id: "test-user-id",
        score: 80,
        feedback: "発音がとても良いです",
        created_at: "2024-03-25T00:00:00Z",
        updated_at: "2024-03-25T00:00:00Z",
      };

      vi.mocked(supabase.from("audio_evaluations").select().eq().single).mockResolvedValue({
        data: mockData,
        error: null,
      });

      const result = await audioEvaluationRepository.findById("test-id");

      expect(result).toBeDefined();
      expect(result?.id).toBe(mockData.id);
      expect(result?.audioFileId).toBe(mockData.audio_file_id);
      expect(result?.userId).toBe(mockData.user_id);
      expect(result?.score).toBe(mockData.score);
      expect(result?.feedback).toBe(mockData.feedback);
      expect(result?.createdAt).toEqual(new Date(mockData.created_at));
      expect(result?.updatedAt).toEqual(new Date(mockData.updated_at));
    });

    test("存在しない評価はnullを返す", async () => {
      vi.mocked(supabase.from("audio_evaluations").select().eq().single).mockResolvedValue({
        data: null,
        error: null,
      });

      const result = await audioEvaluationRepository.findById("non-existent-id");

      expect(result).toBeNull();
    });

    test("エラーが発生した場合は例外をスローする", async () => {
      vi.mocked(supabase.from("audio_evaluations").select().eq().single).mockResolvedValue({
        data: null,
        error: new Error("データベースエラー"),
      });

      await expect(audioEvaluationRepository.findById("test-id")).rejects.toThrow(
        "評価の取得に失敗しました"
      );
    });
  });

  describe("findByAudioFileId", () => {
    test("音声ファイルIDで評価を取得できる", async () => {
      const mockData = [
        {
          id: "test-id-1",
          audio_file_id: "test-audio-id",
          user_id: "test-user-id-1",
          score: 80,
          feedback: "発音がとても良いです",
          created_at: "2024-03-25T00:00:00Z",
          updated_at: "2024-03-25T00:00:00Z",
        },
        {
          id: "test-id-2",
          audio_file_id: "test-audio-id",
          user_id: "test-user-id-2",
          score: 90,
          feedback: "とても良い発音です",
          created_at: "2024-03-25T00:00:00Z",
          updated_at: "2024-03-25T00:00:00Z",
        },
      ];

      vi.mocked(supabase.from("audio_evaluations").select().eq).mockResolvedValue({
        data: mockData,
        error: null,
      });

      const results = await audioEvaluationRepository.findByAudioFileId(
        "test-audio-id"
      );

      expect(results).toHaveLength(2);
      expect(results[0].id).toBe(mockData[0].id);
      expect(results[1].id).toBe(mockData[1].id);
    });

    test("エラーが発生した場合は例外をスローする", async () => {
      vi.mocked(supabase.from("audio_evaluations").select().eq).mockResolvedValue({
        data: null,
        error: new Error("データベースエラー"),
      });

      await expect(
        audioEvaluationRepository.findByAudioFileId("test-audio-id")
      ).rejects.toThrow("評価の取得に失敗しました");
    });
  });

  describe("findByUserId", () => {
    test("ユーザーIDで評価を取得できる", async () => {
      const mockData = [
        {
          id: "test-id-1",
          audio_file_id: "test-audio-id-1",
          user_id: "test-user-id",
          score: 80,
          feedback: "発音がとても良いです",
          created_at: "2024-03-25T00:00:00Z",
          updated_at: "2024-03-25T00:00:00Z",
        },
        {
          id: "test-id-2",
          audio_file_id: "test-audio-id-2",
          user_id: "test-user-id",
          score: 90,
          feedback: "とても良い発音です",
          created_at: "2024-03-25T00:00:00Z",
          updated_at: "2024-03-25T00:00:00Z",
        },
      ];

      vi.mocked(supabase.from("audio_evaluations").select().eq).mockResolvedValue({
        data: mockData,
        error: null,
      });

      const results = await audioEvaluationRepository.findByUserId(
        "test-user-id"
      );

      expect(results).toHaveLength(2);
      expect(results[0].id).toBe(mockData[0].id);
      expect(results[1].id).toBe(mockData[1].id);
    });

    test("エラーが発生した場合は例外をスローする", async () => {
      vi.mocked(supabase.from("audio_evaluations").select().eq).mockResolvedValue({
        data: null,
        error: new Error("データベースエラー"),
      });

      await expect(
        audioEvaluationRepository.findByUserId("test-user-id")
      ).rejects.toThrow("評価の取得に失敗しました");
    });
  });

  describe("save", () => {
    test("評価を保存できる", async () => {
      const audioEvaluation = createAudioEvaluation({
        audioFileId: "test-audio-id",
        userId: "test-user-id",
        score: 80,
        feedback: "発音がとても良いです",
      });

      vi.mocked(supabase.from("audio_evaluations").upsert).mockResolvedValue({
        error: null,
      });

      await expect(audioEvaluationRepository.save(audioEvaluation)).resolves.not.toThrow();
      expect(supabase.from("audio_evaluations").upsert).toHaveBeenCalledWith({
        id: audioEvaluation.id,
        audio_file_id: audioEvaluation.audioFileId,
        user_id: audioEvaluation.userId,
        score: audioEvaluation.score,
        feedback: audioEvaluation.feedback,
        created_at: audioEvaluation.createdAt.toISOString(),
        updated_at: audioEvaluation.updatedAt.toISOString(),
      });
    });

    test("エラーが発生した場合は例外をスローする", async () => {
      const audioEvaluation = createAudioEvaluation({
        audioFileId: "test-audio-id",
        userId: "test-user-id",
        score: 80,
        feedback: "発音がとても良いです",
      });

      vi.mocked(supabase.from("audio_evaluations").upsert).mockResolvedValue({
        error: new Error("データベースエラー"),
      });

      await expect(audioEvaluationRepository.save(audioEvaluation)).rejects.toThrow(
        "評価の保存に失敗しました"
      );
    });
  });

  describe("delete", () => {
    test("評価を削除できる", async () => {
      vi.mocked(supabase.from("audio_evaluations").delete().eq).mockResolvedValue({
        error: null,
      });

      await expect(audioEvaluationRepository.delete("test-id")).resolves.not.toThrow();
      expect(supabase.from("audio_evaluations").delete().eq).toHaveBeenCalledWith(
        "id",
        "test-id"
      );
    });

    test("エラーが発生した場合は例外をスローする", async () => {
      vi.mocked(supabase.from("audio_evaluations").delete().eq).mockResolvedValue({
        error: new Error("データベースエラー"),
      });

      await expect(audioEvaluationRepository.delete("test-id")).rejects.toThrow(
        "評価の削除に失敗しました"
      );
    });
  });
}); 