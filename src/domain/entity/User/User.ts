export interface User {
  readonly id: string;
  readonly username: string;
  readonly displayName: string | null;
  readonly avatarUrl: string | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface UserProfile {
  readonly id: string;
  readonly username: string;
  readonly displayName: string | null;
  readonly avatarUrl: string | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export const createUser = (props: {
  id: string;
  username: string;
  displayName?: string | null;
  avatarUrl?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}): User => {
  if (!props.username) {
    throw new Error("ユーザー名は空にできません");
  }

  return {
    id: props.id,
    username: props.username,
    displayName: props.displayName ?? null,
    avatarUrl: props.avatarUrl ?? null,
    createdAt: props.createdAt ?? new Date(),
    updatedAt: props.updatedAt ?? new Date(),
  };
};

export const updateUserProfile = (
  user: User,
  props: {
    displayName?: string | null;
    avatarUrl?: string | null;
  }
): User => {
  return {
    ...user,
    displayName: props.displayName ?? user.displayName,
    avatarUrl: props.avatarUrl ?? user.avatarUrl,
    updatedAt: new Date(),
  };
}; 