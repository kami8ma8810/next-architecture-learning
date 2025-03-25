import { describe, expect, test, vi, beforeEach } from "bun:test";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AudioPlayer } from "../AudioPlayer";

vi.mock("@/plugins/i18n", () => ({
  useLocalI18n: () => ({
    t: (key: string) => key,
  }),
}));

describe("AudioPlayer", () => {
  const mockProps = {
    audioUrl: "https://example.com/audio/test.mp3",
    onPlay: vi.fn(),
    onPause: vi.fn(),
    onEnded: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("再生/一時停止ボタンが表示される", () => {
    render(<AudioPlayer {...mockProps} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  test("再生ボタンをクリックすると再生が開始される", async () => {
    render(<AudioPlayer {...mockProps} />);

    const playButton = screen.getByRole("button");
    fireEvent.click(playButton);

    await waitFor(() => {
      expect(mockProps.onPlay).toHaveBeenCalled();
    });
  });

  test("一時停止ボタンをクリックすると再生が一時停止される", async () => {
    render(<AudioPlayer {...mockProps} />);

    const playButton = screen.getByRole("button");
    fireEvent.click(playButton);
    fireEvent.click(playButton);

    await waitFor(() => {
      expect(mockProps.onPause).toHaveBeenCalled();
    });
  });

  test("シークバーで再生位置を変更できる", () => {
    render(<AudioPlayer {...mockProps} />);

    const seekBar = screen.getByRole("slider");
    fireEvent.change(seekBar, { target: { value: "30" } });

    expect(seekBar).toHaveValue(30);
  });

  test("再生時間が表示される", () => {
    render(<AudioPlayer {...mockProps} />);

    const timeDisplay = screen.getAllByText("0:00");
    expect(timeDisplay).toHaveLength(2);
  });

  test("再生が終了するとonEndedが呼ばれる", async () => {
    render(<AudioPlayer {...mockProps} />);

    const audioElement = screen.getByRole("audio");
    fireEvent.ended(audioElement);

    await waitFor(() => {
      expect(mockProps.onEnded).toHaveBeenCalled();
    });
  });
}); 