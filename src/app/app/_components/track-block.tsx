"use client";

import Image from "next/image";
import Placeholder from "@/assets/avatar-placeholder.jpg";
import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { Button } from "@/components/ui/button";
import { Lock, Pause, Play } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import TrackDropdownMenu from "./track-dropdown-menu";
import { getSignedUrlsBySlug } from "@/actions/track";

const TrackBlock = ({ track, author }: { track: Track; author: User }) => {
  const { user } = useAuth();
  const [trackUrl, setTrackUrl] = useState<string | undefined>(undefined);
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [isAuthor, setIsAuthor] = useState(false);
  const [isPlaying, toggleIsPlaying] = useState(false);

  const containerRef = useRef(null);
  const waveSurferRef = useRef(null);

  useEffect(() => {
    if (!track.peaks || track.peaks.length === 0) {
      // try again to analytics
    }
  }, []);

  useEffect(() => {
    const getSignedUrl = async () => {
      const urls = await getSignedUrlsBySlug(track.slug);
      setTrackUrl(urls.trackSignedUrl);
      setImageUrl(urls.imageSignedUrl);
    };

    getSignedUrl();
  }, [track]);

  useEffect(() => {
    if (author.id === user?.id) {
      setIsAuthor(true);
    }
  }, [user]);

  useEffect(() => {
    if (!track.peaks || track.peaks.length === 0) {
      return;
    }

    const waveSurfer = WaveSurfer.create({
      container: containerRef.current!,
      cursorWidth: 0,
      url: trackUrl,
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
  }, [trackUrl]);

  return (
    <div className="flex w-full">
      <Image
        src={imageUrl ?? Placeholder}
        width={250}
        height={250}
        alt={track.title}
        className="aspect-square rounded-md object-cover"
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
            className="text-3xl font-medium transition hover:text-primary/90"
          >
            {track.title}
          </Link>
        </div>
        {track.peaks && track.peaks.length !== 0 ? (
          <div>
            <div ref={containerRef} />
          </div>
        ) : (
          <div>
            <p className="text-center">Трек анализируется</p>
          </div>
        )}
        <div className="inline-flex w-full items-center justify-between rounded-md bg-slate-200 p-1">
          <div className="flex items-center">
            {!track.isPublic && (
              <Lock className="size-6 pl-2 text-muted-foreground" />
            )}
            <Button variant="link">
              <Link href={"/app/user/" + author.username}>
                {author.username}
              </Link>
            </Button>
          </div>
          <div className="inline-flex items-center gap-x-2">
            <Button variant="ghost" size="sm" asChild>
              <span>{track.genres[0]}</span>
            </Button>
            {isAuthor && <TrackDropdownMenu track={track} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackBlock;
