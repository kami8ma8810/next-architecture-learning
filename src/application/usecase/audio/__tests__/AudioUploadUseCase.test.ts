import { describe, expect, test, beforeEach, vi } from "bun:test";
import { SupabaseClient } from "@supabase/supabase-js";
import { AudioFileRepository } from "../../../../domain/repository/AudioFileRepository/AudioFileRepository";
import { AudioUploadUseCase } from "../AudioUploadUseCase";
import { User, createUser } from "../../../../domain/entity/User/User";
import { AudioFile, createAudioFile } from "../../../../domain/entity/AudioFile/AudioFile";

describe("AudioUploadUseCase", () => {
  let supabase: SupabaseClient;
  let audioFileRepository: AudioFileRepository;
  let audioUploadUseCase: AudioUploadUseCase;
  let mockUser: User;

  beforeEach(() => {
    supabase = {
      storage: {
        from: vi.fn().mockReturnValue({
          upload: vi.fn(),
          getPublicUrl: vi.fn(),
          remove: vi.fn(),
        }),
      },
    } as unknown as SupabaseClient;

    audioFileRepository = {
      findById: vi.fn(),
      findByUserId: vi.fn(),
      findByReadingTextId: vi.fn(),
      save: vi.fn(),
      delete: vi.fn(),
    } as unknown as AudioFileRepository;

    audioUploadUseCase = new AudioUploadUseCase(supabase, audioFileRepository);

    mockUser = createUser({
      id: "test-user-id",
      username: "testuser",
      displayName: "Test User",
      avatarUrl: "https://example.com/avatar.jpg",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });

  describe("uploadAudio", () => {
    const mockFile = new File(["test"], "test.mp3", { type: "audio/mpeg" });
    const mockParams = {
      file: mockFile,
      readingTextId: "test-reading-text-id",
      duration: 60,
    };

    test("音声ファイルをアップロードできる", async () => {
      const mockUploadData = { path: "test/path" };
      const mockPublicUrl = "https://example.com/audio/test.mp3";

      vi.mocked(supabase.storage.from("audio-files").upload).mockResolvedValue({
        data: mockUploadData,
        error: null,
      });

      vi.mocked(supabase.storage.from("audio-files").getPublicUrl).mockReturnValue({
        data: { publicUrl: mockPublicUrl },
      });

      vi.mocked(audioFileRepository.save).mockResolvedValue(undefined);

      const result = await audioUploadUseCase.uploadAudio(mockParams, mockUser);

      expect(result).toBeDefined();
      expect(result.userId).toBe(mockUser.id);
      expect(result.readingTextId).toBe(mockParams.readingTextId);
      expect(result.duration).toBe(mockParams.duration);
      expect(result.fileSize).toBe(mockFile.size);
      expect(result.mimeType).toBe(mockFile.type);
      expect(supabase.storage.from("audio-files").upload).toHaveBeenCalled();
      expect(audioFileRepository.save).toHaveBeenCalled();
    });

    test("ファイルサイズが制限を超える場合はエラーをスローする", async () => {
      const largeFile = new File(["x".repeat(11 * 1024 * 1024)], "large.mp3", {
        type: "audio/mpeg",
      });

      await expect(
        audioUploadUseCase.uploadAudio(
          { ...mockParams, file: largeFile },
          mockUser
        )
      ).rejects.toThrow("ファイルサイズは10MB以下である必要があります");
    });

    test("音声ファイル以外はアップロードできない", async () => {
      const textFile = new File(["test"], "test.txt", { type: "text/plain" });

      await expect(
        audioUploadUseCase.uploadAudio(
          { ...mockParams, file: textFile },
          mockUser
        )
      ).rejects.toThrow("音声ファイルのみアップロード可能です");
    });
  });

  describe("deleteAudio", () => {
    const mockAudioFile = createAudioFile({
      id: "test-audio-id",
      userId: mockUser.id,
      readingTextId: "test-reading-text-id",
      filePath: "test/path/test.mp3",
      duration: 60,
      fileSize: 1024,
      mimeType: "audio/mpeg",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    test("音声ファイルを削除できる", async () => {
      vi.mocked(audioFileRepository.findById).mockResolvedValue(mockAudioFile);
      vi.mocked(supabase.storage.from("audio-files").remove).mockResolvedValue({
        error: null,
      });
      vi.mocked(audioFileRepository.delete).mockResolvedValue(undefined);

      await expect(
        audioUploadUseCase.deleteAudio(mockAudioFile.id, mockUser)
      ).resolves.not.toThrow();
      expect(supabase.storage.from("audio-files").remove).toHaveBeenCalledWith([
        mockAudioFile.filePath,
      ]);
      expect(audioFileRepository.delete).toHaveBeenCalledWith(mockAudioFile.id);
    });

    test("存在しない音声ファイルは削除できない", async () => {
      vi.mocked(audioFileRepository.findById).mockResolvedValue(null);

      await expect(
        audioUploadUseCase.deleteAudio("non-existent-id", mockUser)
      ).rejects.toThrow("音声ファイルが見つかりません");
    });

    test("他のユーザーの音声ファイルは削除できない", async () => {
      const otherUserAudio = createAudioFile({
        ...mockAudioFile,
        userId: "other-user-id",
      });

      vi.mocked(audioFileRepository.findById).mockResolvedValue(otherUserAudio);

      await expect(
        audioUploadUseCase.deleteAudio(otherUserAudio.id, mockUser)
      ).rejects.toThrow("この音声ファイルを削除する権限がありません");
    });
  });
}); 