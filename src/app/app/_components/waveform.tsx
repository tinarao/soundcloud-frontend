"use client";

import { LoaderCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";

type WaveformProps = {
  track: Track;
  audioFileUrl?: string;

  isListenCaptured: boolean;
  isPlaying: boolean;

  onPlay?: () => void;
};

const Waveform = ({
  track,
  audioFileUrl,
  isPlaying,
  isListenCaptured,
  onPlay,
}: WaveformProps) => {
  const [isReady, setIsReady] = useState(false);
  const containerRef = useRef(null);
  const waveSurferRef = useRef<WaveSurfer | null>(null);

  useEffect(() => {
    if (!track.peaks || track.peaks.length === 0) {
      return;
    }

    const waveSurfer = WaveSurfer.create({
      container: containerRef.current!,
      cursorWidth: 0,
      url: audioFileUrl,
      barWidth: 4,
      barGap: 0,
      //   barHeight: 0.7,
      barAlign: "bottom",
      waveColor: "#00cebf",
      progressColor: "#d492d6",
      barRadius: 2,
      backend: "MediaElement",
      peaks: [track.peaks ?? []],
      duration: 210,
    });

    waveSurfer.on("ready", () => {
      waveSurferRef.current = waveSurfer;
      setIsReady(true);
    });

    waveSurfer.on("play", async () => {
      onPlay?.();
    });

    return () => {
      waveSurfer.destroy();
    };
  }, [audioFileUrl]);

  useEffect(() => {
    if (!waveSurferRef || !waveSurferRef.current) return;

    if (isPlaying) {
      waveSurferRef.current.play();
    } else {
      waveSurferRef.current.pause();
    }
  }, [isPlaying]);

  return (
    <div>
      <div ref={containerRef} className={isReady ? "" : "hidden"} />
      {!isReady && (
        <div className="flex size-full items-center justify-center">
          <LoaderCircle className="size-4 animate-spin" />
        </div>
      )}
    </div>
  );
};

export default Waveform;
