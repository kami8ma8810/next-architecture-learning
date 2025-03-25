import { describe, expect, test, vi, beforeEach } from "bun:test";
import { render, screen, fireEvent } from "@testing-library/react";
import { AudioEvaluation } from "../AudioEvaluation";

vi.mock("@/plugins/i18n", () => ({
  useLocalI18n: () => ({
    t: (key: string) => key,
  }),
}));

describe("AudioEvaluation", () => {
  const mockProps = {
    audioUrl: "https://example.com/audio/test.mp3",
    onEvaluate: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("評価フォームが表示される", () => {
    render(<AudioEvaluation {...mockProps} />);
    expect(screen.getByText("音声の評価")).toBeInTheDocument();
    expect(screen.getByText("スコア")).toBeInTheDocument();
    expect(screen.getByText("フィードバック")).toBeInTheDocument();
    expect(screen.getByText("評価を送信")).toBeInTheDocument();
  });

  test("スコアを変更できる", () => {
    render(<AudioEvaluation {...mockProps} />);

    const scoreInput = screen.getByRole("slider");
    fireEvent.change(scoreInput, { target: { value: "75" } });

    expect(scoreInput).toHaveValue(75);
    expect(screen.getByText("75")).toBeInTheDocument();
  });

  test("フィードバックを入力できる", () => {
    render(<AudioEvaluation {...mockProps} />);

    const feedbackInput = screen.getByRole("textbox");
    fireEvent.change(feedbackInput, {
      target: { value: "発音がとても良いです" },
    });

    expect(feedbackInput).toHaveValue("発音がとても良いです");
  });

  test("フォームを送信するとonEvaluateが呼ばれる", () => {
    render(<AudioEvaluation {...mockProps} />);

    const scoreInput = screen.getByRole("slider");
    const feedbackInput = screen.getByRole("textbox");
    const submitButton = screen.getByText("評価を送信");

    fireEvent.change(scoreInput, { target: { value: "80" } });
    fireEvent.change(feedbackInput, {
      target: { value: "発音がとても良いです" },
    });
    fireEvent.click(submitButton);

    expect(mockProps.onEvaluate).toHaveBeenCalledWith(80, "発音がとても良いです");
  });
}); 