import "@testing-library/jest-dom";
import { vi } from "vitest";

// グローバルなモックの設定
vi.mock("@/application/usecase/auth/AuthUseCase", () => ({
  AuthUseCase: vi.fn().mockImplementation(() => ({
    signUp: vi.fn(),
    signIn: vi.fn(),
    signOut: vi.fn(),
    getCurrentUser: vi.fn(),
  })),
}));

vi.mock("@/infra/repository/Supabase/UserRepositoryImpl", () => ({
  UserRepositoryImpl: vi.fn().mockImplementation(() => ({
    findById: vi.fn(),
    findByUsername: vi.fn(),
    save: vi.fn(),
    delete: vi.fn(),
  })),
})); 