import { Headphones, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

const TrackStats = ({
  track,
  className,
}: {
  track: Track;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-x-4 font-normal",
        className,
      )}
    >
      <div className="flex items-center gap-x-1">
        <Heart className="size-4" stroke="black" />
        <span>{track.likes}</span>
      </div>
      <div className="flex items-center gap-x-1">
        <Headphones className="size-4" />
        {track.listens}
      </div>
    </div>
  );
};

export default TrackStats;
