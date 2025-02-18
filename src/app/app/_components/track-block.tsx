"use client";

import Image from "next/image";
import Placeholder from "@/assets/avatar-placeholder.jpg";
import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { Button } from "@/components/ui/button";
import { AudioWaveform, Ear, Lock, Pause, Play } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import TrackDropdownMenu from "./track-dropdown-menu";
import { captureListen, getSignedUrlsBySlug } from "@/actions/track";
import Waveform from "./waveform";

const TrackBlock = ({ track, author }: { track: Track; author: User }) => {
  const { user } = useAuth();
  const [audioFileUrl, setAudioFileUrl] = useState<string | undefined>(
    undefined,
  );
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [isAuthor, setIsAuthor] = useState(false);
  const [isPlaying, toggleIsPlaying] = useState(false);
  const [isListenCaptured, setIsListenCaptured] = useState(false);

  useEffect(() => {
    if (!track.peaks || track.peaks.length === 0) {
      // try again to analytics
    }
  }, []);

  useEffect(() => {
    const getSignedUrl = async () => {
      const urls = await getSignedUrlsBySlug(track.slug);
      setAudioFileUrl(urls.trackSignedUrl);
      setImageUrl(urls.imageSignedUrl);
    };

    getSignedUrl();
  }, [track]);

  useEffect(() => {
    if (author.id === user?.id) {
      setIsAuthor(true);
    }
  }, [user]);

  const captureListenEvent = async () => {
    if (isListenCaptured) {
      return;
    }

    const result = await captureListen(track.slug);
    if (result.ok) {
      console.log("Listen captured.");
      setIsListenCaptured(true);
      return;
    }
  };

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
            onClick={() => toggleIsPlaying(!isPlaying)}
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

        <Waveform
          track={track}
          audioFileUrl={audioFileUrl}
          isListenCaptured={isListenCaptured}
          isPlaying={isPlaying}
          onPlay={() => captureListenEvent()}
        />

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
            <span className="flex w-10 items-center justify-center text-sm font-medium text-muted-foreground">
              <AudioWaveform className="mr-2 size-4" />
              {track.listens}
            </span>
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
