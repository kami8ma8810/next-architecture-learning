import { SupabaseClient } from "@supabase/supabase-js";
import { User, createUser } from "../../../domain/entity/User/User";
import { UserRepository } from "../../../domain/repository/UserRepository/UserRepository";

export interface SignUpParams {
  email: string;
  password: string;
  username: string;
  displayName?: string;
  avatarUrl?: string;
}

export interface SignInParams {
  email: string;
  password: string;
}

export class AuthUseCase {
  constructor(
    private readonly supabase: SupabaseClient,
    private readonly userRepository: UserRepository
  ) {}

  async signUp(params: SignUpParams): Promise<User> {
    const { data: authData, error: authError } = await this.supabase.auth.signUp({
      email: params.email,
      password: params.password,
    });

    if (authError) {
      throw authError;
    }

    if (!authData.user) {
      throw new Error("ユーザー作成に失敗しました");
    }

    const user = createUser({
      id: authData.user.id,
      username: params.username,
      displayName: params.displayName ?? params.username,
      avatarUrl: params.avatarUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.userRepository.save(user);

    return user;
  }

  async signIn(params: SignInParams): Promise<User> {
    const { data: authData, error: authError } = await this.supabase.auth.signInWithPassword({
      email: params.email,
      password: params.password,
    });

    if (authError) {
      throw authError;
    }

    if (!authData.user) {
      throw new Error("ログインに失敗しました");
    }

    const user = await this.userRepository.findById(authData.user.id);
    if (!user) {
      throw new Error("ユーザーが見つかりません");
    }

    return user;
  }

  async signOut(): Promise<void> {
    const { error } = await this.supabase.auth.signOut();
    if (error) {
      throw error;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    const { data: { user: authUser }, error } = await this.supabase.auth.getUser();

    if (error) {
      throw error;
    }

    if (!authUser) {
      return null;
    }

    const user = await this.userRepository.findById(authUser.id);
    return user;
  }
} 