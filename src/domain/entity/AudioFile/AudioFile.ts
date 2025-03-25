export interface AudioFile {
  readonly id: string;
  readonly userId: string;
  readonly readingTextId: string;
  readonly filePath: string;
  readonly duration: number;
  readonly fileSize: number;
  readonly mimeType: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export const createAudioFile = (props: {
  id: string;
  userId: string;
  readingTextId: string;
  filePath: string;
  duration: number;
  fileSize: number;
  mimeType: string;
  createdAt?: Date;
  updatedAt?: Date;
}): AudioFile => {
  if (props.duration < 0) {
    throw new Error("音声の長さは0以上である必要があります");
  }

  if (props.fileSize <= 0) {
    throw new Error("ファイルサイズは0より大きい必要があります");
  }

  if (!props.mimeType.startsWith("audio/")) {
    throw new Error("音声ファイルのみアップロード可能です");
  }

  return {
    id: props.id,
    userId: props.userId,
    readingTextId: props.readingTextId,
    filePath: props.filePath,
    duration: props.duration,
    fileSize: props.fileSize,
    mimeType: props.mimeType,
    createdAt: props.createdAt ?? new Date(),
    updatedAt: props.updatedAt ?? new Date(),
  };
}; 