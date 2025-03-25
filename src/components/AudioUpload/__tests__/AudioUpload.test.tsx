import { describe, expect, test, vi, beforeEach } from "bun:test";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AudioUpload } from "../AudioUpload";
import { createUser } from "@/domain/entity/User/User";
import { AudioUploadUseCase } from "@/application/usecase/audio/AudioUploadUseCase";

vi.mock("@/application/usecase/audio/AudioUploadUseCase");
vi.mock("@/plugins/i18n", () => ({
  useLocalI18n: () => ({
    t: (key: string) => key,
  }),
}));

describe("AudioUpload", () => {
  const mockUser = createUser({
    id: "test-user-id",
    username: "testuser",
    displayName: "Test User",
    avatarUrl: "https://example.com/avatar.jpg",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const mockProps = {
    readingTextId: "test-reading-text-id",
    user: mockUser,
    onUploadSuccess: vi.fn(),
    onUploadError: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("アップロードボタンが表示される", () => {
    render(<AudioUpload {...mockProps} />);
    expect(screen.getByText("音声ファイルをアップロード")).toBeInTheDocument();
  });

  test("音声ファイルをアップロードできる", async () => {
    const mockFile = new File(["test"], "test.mp3", { type: "audio/mpeg" });
    const mockAudioFile = {
      id: "test-audio-id",
      userId: mockUser.id,
      readingTextId: mockProps.readingTextId,
      filePath: "test/path/test.mp3",
      duration: 60,
      fileSize: 1024,
      mimeType: "audio/mpeg",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(AudioUploadUseCase.prototype.uploadAudio).mockResolvedValue(
      mockAudioFile
    );

    render(<AudioUpload {...mockProps} />);

    const input = screen.getByLabelText("音声ファイルをアップロード");
    fireEvent.change(input, { target: { files: [mockFile] } });

    await waitFor(() => {
      expect(mockProps.onUploadSuccess).toHaveBeenCalledWith(mockAudioFile);
    });
  });

  test("アップロード中はボタンが無効化される", async () => {
    const mockFile = new File(["test"], "test.mp3", { type: "audio/mpeg" });
    vi.mocked(AudioUploadUseCase.prototype.uploadAudio).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    render(<AudioUpload {...mockProps} />);

    const input = screen.getByLabelText("音声ファイルをアップロード");
    fireEvent.change(input, { target: { files: [mockFile] } });

    expect(screen.getByText("アップロード中...")).toBeInTheDocument();
  });

  test("エラーが発生した場合はエラーメッセージが表示される", async () => {
    const mockFile = new File(["test"], "test.mp3", { type: "audio/mpeg" });
    const mockError = new Error("アップロードに失敗しました");
    vi.mocked(AudioUploadUseCase.prototype.uploadAudio).mockRejectedValue(
      mockError
    );

    render(<AudioUpload {...mockProps} />);

    const input = screen.getByLabelText("音声ファイルをアップロード");
    fireEvent.change(input, { target: { files: [mockFile] } });

    await waitFor(() => {
      expect(screen.getByText("アップロードに失敗しました")).toBeInTheDocument();
      expect(mockProps.onUploadError).toHaveBeenCalledWith(mockError);
    });
  });
}); 