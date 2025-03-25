import { useState, useCallback } from "react";
import { useLocalI18n } from "@/plugins/i18n";
import { AudioUploadUseCase } from "@/application/usecase/audio/AudioUploadUseCase";
import { User } from "@/domain/entity/User/User";

interface AudioUploadProps {
  readingTextId: string;
  user: User;
  onUploadSuccess?: (audioFile: any) => void;
  onUploadError?: (error: Error) => void;
}

export const AudioUpload: React.FC<AudioUploadProps> = ({
  readingTextId,
  user,
  onUploadSuccess,
  onUploadError,
}) => {
  const { t } = useLocalI18n();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      setIsUploading(true);
      setError(null);

      try {
        const audioUploadUseCase = new AudioUploadUseCase(
          window.supabase,
          window.audioFileRepository
        );

        const result = await audioUploadUseCase.uploadAudio(
          {
            file,
            readingTextId,
            duration: 0, // TODO: 音声ファイルの長さを取得する
          },
          user
        );

        onUploadSuccess?.(result);
      } catch (err) {
        const error = err as Error;
        setError(error.message);
        onUploadError?.(error);
      } finally {
        setIsUploading(false);
      }
    },
    [readingTextId, user, onUploadSuccess, onUploadError]
  );

  return (
    <div className="_space-y-4">
      <div className="_flex _items-center _space-x-4">
        <label
          htmlFor="audio-upload"
          className="_inline-flex _items-center _px-4 _py-2 _bg-blue-600 _text-white _rounded-md _hover:bg-blue-700 _focus:outline-none _focus:ring-2 _focus:ring-offset-2 _focus:ring-blue-500 _disabled:opacity-50 _disabled:cursor-not-allowed"
        >
          {isUploading ? t("アップロード中...") : t("音声ファイルをアップロード")}
        </label>
        <input
          id="audio-upload"
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          disabled={isUploading}
          className="_hidden"
        />
      </div>

      {error && (
        <div className="_text-red-600 _text-sm">{error}</div>
      )}

      {isUploading && (
        <div className="_text-gray-600 _text-sm">
          {t("アップロード中...")}
        </div>
      )}
    </div>
  );
}; 