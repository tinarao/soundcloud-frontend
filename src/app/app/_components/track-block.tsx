"use client";

import Image from "next/image";
import Placeholder from "@/assets/avatar-placeholder.jpg";
import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { Button } from "@/components/ui/button";
import { Lock, Pause, Play } from "lucide-react";
import axios from "axios";
import Link from "next/link";

const TrackBlock = ({ track, author }: { track: Track; author: User }) => {
  const [isPlaying, toggleIsPlaying] = useState(false);

  const containerRef = useRef(null);
  const waveSurferRef = useRef(null);

  useEffect(() => {
    if (!track.peaks || track.peaks.length === 0) {
      // try again to analytics
    }
  }, []);

  useEffect(() => {
    const waveSurfer = WaveSurfer.create({
      container: containerRef.current!,
      cursorWidth: 0,
      url: `http://localhost:5129/api/File/${track.slug}`,
      barWidth: 6,
      barHeight: 0.7,
      waveColor: "#d492d6",
      progressColor: "#cb748e",
      barRadius: 2,
      backend: "MediaElement",
      peaks: [track.peaks ?? []],
      duration: 210,
    });

    waveSurfer.on("ready", () => {
      // @ts-ignore
      waveSurferRef.current = waveSurfer;
    });

    return () => {
      waveSurfer.destroy();
    };
  }, []);

  return (
    <div className="flex w-full">
      <Image
        src={Placeholder}
        width={250}
        height={250}
        alt={track.title}
        className="rounded-md"
      />
      <div className="flex w-full flex-col justify-between pl-2">
        <div className="inline-flex items-center gap-x-3">
          <Button
            size="icon"
            className="rounded-full"
            onClick={() => {
              if (isPlaying) {
                // @ts-ignore
                waveSurferRef.current.pause();
              } else {
                // @ts-ignore
                waveSurferRef.current.play();
              }
              toggleIsPlaying(!isPlaying);
            }}
          >
            {isPlaying ? (
              <Pause className="fill-white" />
            ) : (
              <Play className="fill-white" />
            )}
          </Button>
          <Link
            href={"/app/track/" + track.slug}
            className="text-3xl font-medium hover:text-primary/50"
          >
            {track.title}
          </Link>
        </div>
        <div>
          <div ref={containerRef} />
        </div>
        <div className="inline-flex w-full items-center justify-between rounded-md bg-slate-200 p-1">
          <div className="flex items-center">
            {!track.isPublic && (
              <Button variant="ghost" size="icon">
                <Lock className="text-muted-foreground" />
              </Button>
            )}
            <Button variant="link">{author.username}</Button>
          </div>
          <Button>{track.genres[0]}</Button>
        </div>
      </div>
    </div>
  );
};

export default TrackBlock;
