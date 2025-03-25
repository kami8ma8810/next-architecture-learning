import { useState } from "react";
import { useLocalI18n } from "@/plugins/i18n";

interface AudioEvaluationProps {
  audioUrl: string;
  onEvaluate: (score: number, feedback: string) => void;
}

export const AudioEvaluation: React.FC<AudioEvaluationProps> = ({
  audioUrl,
  onEvaluate,
}) => {
  const { t } = useLocalI18n();
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onEvaluate(score, feedback);
  };

  return (
    <div className="_space-y-4">
      <h3 className="_text-lg _font-medium _text-gray-900">
        {t("音声の評価")}
      </h3>
      <form onSubmit={handleSubmit} className="_space-y-4">
        <div>
          <label
            htmlFor="score"
            className="_block _text-sm _font-medium _text-gray-700"
          >
            {t("スコア")}
          </label>
          <div className="_mt-1">
            <input
              type="range"
              id="score"
              min={0}
              max={100}
              value={score}
              onChange={(e) => setScore(Number(e.target.value))}
              className="_w-full _h-1 _bg-gray-200 _rounded-lg _appearance-none _cursor-pointer"
            />
            <div className="_flex _justify-between _text-sm _text-gray-600">
              <span>0</span>
              <span>{score}</span>
              <span>100</span>
            </div>
          </div>
        </div>

        <div>
          <label
            htmlFor="feedback"
            className="_block _text-sm _font-medium _text-gray-700"
          >
            {t("フィードバック")}
          </label>
          <div className="_mt-1">
            <textarea
              id="feedback"
              rows={4}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="_shadow-sm _focus:ring-blue-500 _focus:border-blue-500 _block _w-full _sm:text-sm _border-gray-300 _rounded-md"
              placeholder={t("フィードバックを入力してください")}
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="_inline-flex _justify-center _py-2 _px-4 _border _border-transparent _shadow-sm _text-sm _font-medium _rounded-md _text-white _bg-blue-600 _hover:bg-blue-700 _focus:outline-none _focus:ring-2 _focus:ring-offset-2 _focus:ring-blue-500"
          >
            {t("評価を送信")}
          </button>
        </div>
      </form>
    </div>
  );
}; 