import { SupabaseClient } from "@supabase/supabase-js";
import { UserRepository } from "../../../domain/repository/UserRepository/UserRepository";
import { User, createUser } from "../../../domain/entity/User/User";

export class UserRepositoryImpl implements UserRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async findById(id: string): Promise<User | null> {
    const { data, error } = await this.supabase
      .from("user_profiles")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      return null;
    }

    return createUser({
      id: data.id,
      username: data.username,
      displayName: data.display_name,
      avatarUrl: data.avatar_url,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    });
  }

  async findByUsername(username: string): Promise<User | null> {
    const { data, error } = await this.supabase
      .from("user_profiles")
      .select("*")
      .eq("username", username)
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      return null;
    }

    return createUser({
      id: data.id,
      username: data.username,
      displayName: data.display_name,
      avatarUrl: data.avatar_url,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    });
  }

  async save(user: User): Promise<void> {
    const { error } = await this.supabase.from("user_profiles").upsert({
      id: user.id,
      username: user.username,
      display_name: user.displayName,
      avatar_url: user.avatarUrl,
      created_at: user.createdAt.toISOString(),
      updated_at: user.updatedAt.toISOString(),
    });

    if (error) {
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from("user_profiles")
      .delete()
      .eq("id", id);

    if (error) {
      throw error;
    }
  }
} 