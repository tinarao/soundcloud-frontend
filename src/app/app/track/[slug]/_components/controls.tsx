"use client";

import { captureListen } from "@/actions/track";
import Waveform from "@/app/app/_components/waveform";
import { Badge } from "@/components/ui/badge";
import { secondsToMinutes } from "@/lib/utils";
import { Pause, Play } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const TrackPrimaryData = ({
  track,
  audioFileSignedUrl,
}: {
  track: Track;
  audioFileSignedUrl: string;
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isListenCaptured, setIsListenCaptured] = useState(false);

  const captureListenEvent = async () => {
    if (isListenCaptured) {
      return;
    }

    const result = await captureListen(track.slug);
    if (result.ok) {
      setIsListenCaptured(true);
      return;
    }
  };

  const formatter = Intl.DateTimeFormat("ru", {
    timeZone: "Europe/Moscow",
    day: "numeric",
    month: "long",
    year: undefined,
  });

  const createdAt = formatter.format(new Date(track.createdAt));

  return (
    <div className="w-full">
      <div className="flex gap-x-6">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="inline-flex aspect-square size-20 items-center justify-center rounded-full bg-primary transition hover:bg-primary/80"
        >
          {isPlaying ? (
            <Pause className="size-8" fill="white" stroke="white" />
          ) : (
            <Play className="size-8" fill="white" stroke="white" />
          )}
        </button>
        <div className="w-full">
          <div className="flex w-full items-center justify-between gap-x-5">
            <Link
              target="_blank"
              className="text-primary transition hover:text-primary/60 hover:underline"
              href={"/app/user/" + track.user?.slug}
            >
              {track.user?.username}
            </Link>
            <div className="space-x-2">
              {track.genres.map((g) => (
                <Badge variant="outline" key={g}>
                  {g}
                </Badge>
              ))}
              <Badge>{createdAt}</Badge>
            </div>
          </div>
          <h1 className="text-3xl">{track.title}</h1>
        </div>
      </div>
      <div className="h-8 w-full">
        <Waveform
          track={track}
          audioFileUrl={audioFileSignedUrl}
          isListenCaptured={isListenCaptured}
          isPlaying={isPlaying}
          onPlay={() => captureListenEvent()}
        />
        <div className="flex w-full justify-end">
          <span className="text-sm font-medium">
            {secondsToMinutes(track.duration)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TrackPrimaryData;
