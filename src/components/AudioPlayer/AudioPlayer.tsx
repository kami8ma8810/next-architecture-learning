import { useState, useRef, useEffect } from "react";
import { useLocalI18n } from "@/plugins/i18n";

interface AudioPlayerProps {
  audioUrl: string;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioUrl,
  onPlay,
  onPause,
  onEnded,
}) => {
  const { t } = useLocalI18n();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener("timeupdate", () => {
        setCurrentTime(audioRef.current?.currentTime ?? 0);
      });

      audioRef.current.addEventListener("loadedmetadata", () => {
        setDuration(audioRef.current?.duration ?? 0);
      });

      audioRef.current.addEventListener("ended", () => {
        setIsPlaying(false);
        onEnded?.();
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("timeupdate", () => {});
        audioRef.current.removeEventListener("loadedmetadata", () => {});
        audioRef.current.removeEventListener("ended", () => {});
      }
    };
  }, [onEnded]);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        onPause?.();
      } else {
        audioRef.current.play();
        onPlay?.();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(event.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="_space-y-2">
      <audio ref={audioRef} src={audioUrl} />
      <div className="_flex _items-center _space-x-4">
        <button
          onClick={handlePlayPause}
          className="_inline-flex _items-center _justify-center _w-10 _h-10 _bg-blue-600 _text-white _rounded-full _hover:bg-blue-700 _focus:outline-none _focus:ring-2 _focus:ring-offset-2 _focus:ring-blue-500"
        >
          {isPlaying ? (
            <span className="_text-xl">⏸</span>
          ) : (
            <span className="_text-xl">▶</span>
          )}
        </button>
        <div className="_flex-1">
          <input
            type="range"
            min={0}
            max={duration}
            value={currentTime}
            onChange={handleSeek}
            className="_w-full _h-1 _bg-gray-200 _rounded-lg _appearance-none _cursor-pointer"
          />
          <div className="_flex _justify-between _text-sm _text-gray-600">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}; 