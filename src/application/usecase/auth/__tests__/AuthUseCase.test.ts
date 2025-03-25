import { describe, expect, test, beforeEach, vi } from "bun:test";
import { SupabaseClient } from "@supabase/supabase-js";
import { UserRepository } from "../../../../domain/repository/UserRepository/UserRepository";
import { AuthUseCase } from "../AuthUseCase";
import { User, createUser } from "../../../../domain/entity/User/User";

describe("AuthUseCase", () => {
  let supabase: SupabaseClient;
  let userRepository: UserRepository;
  let authUseCase: AuthUseCase;

  beforeEach(() => {
    supabase = {
      auth: {
        signUp: vi.fn(),
        signInWithPassword: vi.fn(),
        signOut: vi.fn(),
        getUser: vi.fn(),
      },
    } as unknown as SupabaseClient;

    userRepository = {
      findById: vi.fn(),
      findByUsername: vi.fn(),
      save: vi.fn(),
      delete: vi.fn(),
    } as unknown as UserRepository;

    authUseCase = new AuthUseCase(supabase, userRepository);
  });

  describe("signUp", () => {
    test("新規ユーザーを作成できる", async () => {
      const mockUser = {
        id: "test-id",
        email: "test@example.com",
      };

      const mockCreatedUser = createUser({
        id: mockUser.id,
        username: "testuser",
        displayName: "Test User",
        avatarUrl: "https://example.com/avatar.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      vi.mocked(supabase.auth.signUp).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      vi.mocked(userRepository.save).mockResolvedValue(undefined);

      const result = await authUseCase.signUp({
        email: "test@example.com",
        password: "password123",
        username: "testuser",
        displayName: "Test User",
        avatarUrl: "https://example.com/avatar.jpg",
      });

      expect(result).toEqual(mockCreatedUser);
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
      expect(userRepository.save).toHaveBeenCalledWith(mockCreatedUser);
    });

    test("認証エラーが発生した場合は例外をスローする", async () => {
      vi.mocked(supabase.auth.signUp).mockResolvedValue({
        data: { user: null },
        error: new Error("認証エラー"),
      });

      await expect(
        authUseCase.signUp({
          email: "test@example.com",
          password: "password123",
          username: "testuser",
        })
      ).rejects.toThrow("認証エラー");
    });
  });

  describe("signIn", () => {
    test("既存ユーザーでログインできる", async () => {
      const mockUser = {
        id: "test-id",
        email: "test@example.com",
      };

      const mockExistingUser = createUser({
        id: mockUser.id,
        username: "testuser",
        displayName: "Test User",
        avatarUrl: "https://example.com/avatar.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      vi.mocked(userRepository.findById).mockResolvedValue(mockExistingUser);

      const result = await authUseCase.signIn({
        email: "test@example.com",
        password: "password123",
      });

      expect(result).toEqual(mockExistingUser);
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
      expect(userRepository.findById).toHaveBeenCalledWith(mockUser.id);
    });

    test("認証エラーが発生した場合は例外をスローする", async () => {
      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
        data: { user: null },
        error: new Error("認証エラー"),
      });

      await expect(
        authUseCase.signIn({
          email: "test@example.com",
          password: "password123",
        })
      ).rejects.toThrow("認証エラー");
    });
  });

  describe("signOut", () => {
    test("ログアウトできる", async () => {
      vi.mocked(supabase.auth.signOut).mockResolvedValue({
        error: null,
      });

      await expect(authUseCase.signOut()).resolves.not.toThrow();
      expect(supabase.auth.signOut).toHaveBeenCalled();
    });

    test("ログアウトエラーが発生した場合は例外をスローする", async () => {
      vi.mocked(supabase.auth.signOut).mockResolvedValue({
        error: new Error("ログアウトエラー"),
      });

      await expect(authUseCase.signOut()).rejects.toThrow("ログアウトエラー");
    });
  });

  describe("getCurrentUser", () => {
    test("現在のユーザーを取得できる", async () => {
      const mockUser = {
        id: "test-id",
        email: "test@example.com",
      };

      const mockExistingUser = createUser({
        id: mockUser.id,
        username: "testuser",
        displayName: "Test User",
        avatarUrl: "https://example.com/avatar.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      vi.mocked(supabase.auth.getUser).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      vi.mocked(userRepository.findById).mockResolvedValue(mockExistingUser);

      const result = await authUseCase.getCurrentUser();

      expect(result).toEqual(mockExistingUser);
      expect(supabase.auth.getUser).toHaveBeenCalled();
      expect(userRepository.findById).toHaveBeenCalledWith(mockUser.id);
    });

    test("ログインしていない場合はnullを返す", async () => {
      vi.mocked(supabase.auth.getUser).mockResolvedValue({
        data: { user: null },
        error: null,
      });

      const result = await authUseCase.getCurrentUser();

      expect(result).toBeNull();
    });
  });
}); 