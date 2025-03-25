import { describe, expect, test, vi, beforeEach } from "bun:test";
import { SupabaseClient } from "@supabase/supabase-js";
import { AudioFileRepository } from "../../../../domain/repository/AudioFileRepository/AudioFileRepository";
import { AudioEvaluationUseCase } from "../AudioEvaluationUseCase";
import { User, createUser } from "../../../../domain/entity/User/User";
import { AudioFile, createAudioFile } from "../../../../domain/entity/AudioFile/AudioFile";

describe("AudioEvaluationUseCase", () => {
  let supabase: SupabaseClient;
  let audioFileRepository: AudioFileRepository;
  let audioEvaluationUseCase: AudioEvaluationUseCase;
  let mockUser: User;

  beforeEach(() => {
    supabase = {
      from: vi.fn().mockReturnValue({
        insert: vi.fn(),
      }),
    } as unknown as SupabaseClient;

    audioFileRepository = {
      findById: vi.fn(),
      findByUserId: vi.fn(),
      findByReadingTextId: vi.fn(),
      save: vi.fn(),
      delete: vi.fn(),
    } as unknown as AudioFileRepository;

    audioEvaluationUseCase = new AudioEvaluationUseCase(
      supabase,
      audioFileRepository
    );

    mockUser = createUser({
      id: "test-user-id",
      username: "testuser",
      displayName: "Test User",
      avatarUrl: "https://example.com/avatar.jpg",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });

  describe("evaluateAudio", () => {
    const mockParams = {
      audioFileId: "test-audio-id",
      score: 80,
      feedback: "発音がとても良いです",
    };

    const mockAudioFile = createAudioFile({
      id: mockParams.audioFileId,
      userId: mockUser.id,
      readingTextId: "test-reading-text-id",
      filePath: "test/path/test.mp3",
      duration: 60,
      fileSize: 1024,
      mimeType: "audio/mpeg",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    test("音声ファイルを評価できる", async () => {
      vi.mocked(audioFileRepository.findById).mockResolvedValue(mockAudioFile);
      vi.mocked(supabase.from("audio_evaluations").insert).mockResolvedValue({
        error: null,
      });

      await expect(
        audioEvaluationUseCase.evaluateAudio(mockParams, mockUser)
      ).resolves.not.toThrow();
      expect(supabase.from("audio_evaluations").insert).toHaveBeenCalledWith({
        audio_file_id: mockParams.audioFileId,
        user_id: mockUser.id,
        score: mockParams.score,
        feedback: mockParams.feedback,
      });
    });

    test("存在しない音声ファイルは評価できない", async () => {
      vi.mocked(audioFileRepository.findById).mockResolvedValue(null);

      await expect(
        audioEvaluationUseCase.evaluateAudio(mockParams, mockUser)
      ).rejects.toThrow("音声ファイルが見つかりません");
    });

    test("他のユーザーの音声ファイルは評価できない", async () => {
      const otherUserAudio = createAudioFile({
        ...mockAudioFile,
        userId: "other-user-id",
      });

      vi.mocked(audioFileRepository.findById).mockResolvedValue(otherUserAudio);

      await expect(
        audioEvaluationUseCase.evaluateAudio(mockParams, mockUser)
      ).rejects.toThrow("この音声ファイルを評価する権限がありません");
    });

    test("スコアは0から100の間である必要がある", async () => {
      vi.mocked(audioFileRepository.findById).mockResolvedValue(mockAudioFile);

      await expect(
        audioEvaluationUseCase.evaluateAudio(
          { ...mockParams, score: -1 },
          mockUser
        )
      ).rejects.toThrow("スコアは0から100の間である必要があります");

      await expect(
        audioEvaluationUseCase.evaluateAudio(
          { ...mockParams, score: 101 },
          mockUser
        )
      ).rejects.toThrow("スコアは0から100の間である必要があります");
    });

    test("フィードバックは必須", async () => {
      vi.mocked(audioFileRepository.findById).mockResolvedValue(mockAudioFile);

      await expect(
        audioEvaluationUseCase.evaluateAudio(
          { ...mockParams, feedback: "" },
          mockUser
        )
      ).rejects.toThrow("フィードバックを入力してください");
    });

    test("評価の保存に失敗した場合はエラーをスローする", async () => {
      vi.mocked(audioFileRepository.findById).mockResolvedValue(mockAudioFile);
      vi.mocked(supabase.from("audio_evaluations").insert).mockResolvedValue({
        error: new Error("データベースエラー"),
      });

      await expect(
        audioEvaluationUseCase.evaluateAudio(mockParams, mockUser)
      ).rejects.toThrow("評価の保存に失敗しました");
    });
  });
}); 