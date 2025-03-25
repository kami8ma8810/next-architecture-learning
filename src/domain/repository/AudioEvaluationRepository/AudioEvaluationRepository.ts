import { AudioEvaluation } from "../../entity/AudioEvaluation/AudioEvaluation";

export interface AudioEvaluationRepository {
  findById(id: string): Promise<AudioEvaluation | null>;
  findByAudioFileId(audioFileId: string): Promise<AudioEvaluation[]>;
  findByUserId(userId: string): Promise<AudioEvaluation[]>;
  save(audioEvaluation: AudioEvaluation): Promise<void>;
  delete(id: string): Promise<void>;
} 