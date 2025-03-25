import { describe, expect, test, vi } from "bun:test";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AuthForm } from "../AuthForm";
import { AuthUseCase } from "@/application/usecase/auth/AuthUseCase";
import { User, createUser } from "@/domain/entity/User/User";

describe("AuthForm", () => {
  const mockUser = createUser({
    id: "test-id",
    username: "testuser",
    displayName: "Test User",
    avatarUrl: "https://example.com/avatar.jpg",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const mockAuthUseCase = {
    signUp: vi.fn(),
    signIn: vi.fn(),
  } as unknown as AuthUseCase;

  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("ログインフォームが表示される", () => {
    render(<AuthForm authUseCase={mockAuthUseCase} onSuccess={mockOnSuccess} />);

    expect(screen.getByLabelText("メールアドレス")).toBeInTheDocument();
    expect(screen.getByLabelText("パスワード")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "ログイン" })).toBeInTheDocument();
  });

  test("新規登録フォームに切り替えられる", () => {
    render(<AuthForm authUseCase={mockAuthUseCase} onSuccess={mockOnSuccess} />);

    fireEvent.click(screen.getByText("新規登録はこちら"));

    expect(screen.getByLabelText("ユーザー名")).toBeInTheDocument();
    expect(screen.getByLabelText("表示名")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "新規登録" })).toBeInTheDocument();
  });

  test("ログインが成功する", async () => {
    mockAuthUseCase.signIn.mockResolvedValue(mockUser);

    render(<AuthForm authUseCase={mockAuthUseCase} onSuccess={mockOnSuccess} />);

    fireEvent.change(screen.getByLabelText("メールアドレス"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("パスワード"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "ログイン" }));

    await waitFor(() => {
      expect(mockAuthUseCase.signIn).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
      expect(mockOnSuccess).toHaveBeenCalledWith(mockUser);
    });
  });

  test("新規登録が成功する", async () => {
    mockAuthUseCase.signUp.mockResolvedValue(mockUser);

    render(<AuthForm authUseCase={mockAuthUseCase} onSuccess={mockOnSuccess} />);

    fireEvent.click(screen.getByText("新規登録はこちら"));
    fireEvent.change(screen.getByLabelText("メールアドレス"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("パスワード"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText("ユーザー名"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByLabelText("表示名"), {
      target: { value: "Test User" },
    });
    fireEvent.click(screen.getByRole("button", { name: "新規登録" }));

    await waitFor(() => {
      expect(mockAuthUseCase.signUp).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
        username: "testuser",
        displayName: "Test User",
      });
      expect(mockOnSuccess).toHaveBeenCalledWith(mockUser);
    });
  });

  test("認証エラーが表示される", async () => {
    const errorMessage = "認証エラーが発生しました";
    mockAuthUseCase.signIn.mockRejectedValue(new Error(errorMessage));

    render(<AuthForm authUseCase={mockAuthUseCase} onSuccess={mockOnSuccess} />);

    fireEvent.change(screen.getByLabelText("メールアドレス"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("パスワード"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "ログイン" }));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });
}); 