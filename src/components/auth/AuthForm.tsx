import { useState } from "react";
import { AuthUseCase } from "@/application/usecase/auth/AuthUseCase";
import { User } from "@/domain/entity/User/User";

interface AuthFormProps {
  authUseCase: AuthUseCase;
  onSuccess: (user: User) => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ authUseCase, onSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isSignUp) {
        const user = await authUseCase.signUp({
          email,
          password,
          username,
          displayName: displayName || undefined,
        });
        onSuccess(user);
      } else {
        const user = await authUseCase.signIn({
          email,
          password,
        });
        onSuccess(user);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "認証エラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="_w-full _max-w-md _mx-auto _p-6 _bg-white _rounded-lg _shadow-md">
      <h2 className="_text-2xl _font-bold _mb-6 _text-center">
        {isSignUp ? "新規登録" : "ログイン"}
      </h2>

      <form onSubmit={handleSubmit} className="_space-y-4">
        <div>
          <label htmlFor="email" className="_block _text-sm _font-medium _text-gray-700">
            メールアドレス
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="_mt-1 _block _w-full _rounded-md _border-gray-300 _shadow-sm _focus:border-indigo-500 _focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="password" className="_block _text-sm _font-medium _text-gray-700">
            パスワード
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="_mt-1 _block _w-full _rounded-md _border-gray-300 _shadow-sm _focus:border-indigo-500 _focus:ring-indigo-500"
          />
        </div>

        {isSignUp && (
          <>
            <div>
              <label htmlFor="username" className="_block _text-sm _font-medium _text-gray-700">
                ユーザー名
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="_mt-1 _block _w-full _rounded-md _border-gray-300 _shadow-sm _focus:border-indigo-500 _focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="displayName" className="_block _text-sm _font-medium _text-gray-700">
                表示名
              </label>
              <input
                type="text"
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="_mt-1 _block _w-full _rounded-md _border-gray-300 _shadow-sm _focus:border-indigo-500 _focus:ring-indigo-500"
              />
            </div>
          </>
        )}

        {error && (
          <div className="_text-red-600 _text-sm">{error}</div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="_w-full _flex _justify-center _py-2 _px-4 _border _border-transparent _rounded-md _shadow-sm _text-sm _font-medium _text-white _bg-indigo-600 _hover:bg-indigo-700 _focus:outline-none _focus:ring-2 _focus:ring-offset-2 _focus:ring-indigo-500 _disabled:opacity-50"
        >
          {isLoading ? "処理中..." : isSignUp ? "新規登録" : "ログイン"}
        </button>

        <button
          type="button"
          onClick={() => setIsSignUp(!isSignUp)}
          className="_w-full _text-sm _text-indigo-600 _hover:text-indigo-500"
        >
          {isSignUp ? "すでにアカウントをお持ちの方はこちら" : "新規登録はこちら"}
        </button>
      </form>
    </div>
  );
}; 