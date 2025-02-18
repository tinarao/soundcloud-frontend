import { ArrowLeft } from "lucide-react";
import { getSignedUrlsBySlug, getTrackBySlug } from "@/actions/track";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import TrackPrimaryData from "./_components/controls";
import TrackStats from "./_components/track-stats";

type TrackPageParams = {
  slug: string;
};

const Page = async ({ params }: { params: TrackPageParams }) => {
  const { slug } = await params;

  const [trackResult, signedUrls] = await Promise.all([
    getTrackBySlug(slug),
    getSignedUrlsBySlug(slug),
  ]);

  const { track } = trackResult;

  if (!trackResult.ok || !track) {
    switch (trackResult.status) {
      case 403:
        return (
          <div className="flex h-48 flex-col items-center justify-center">
            <h1 className="text-2xl font-medium">
              Автор скрыл данную аудиозапись.
            </h1>
            <p className="text-sm font-medium text-neutral-600">
              <Button variant="outline" asChild>
                <Link href="/app">
                  <ArrowLeft /> Вернуться
                </Link>
              </Button>
            </p>
          </div>
        );
      default:
        return redirect("/app");
    }
  }

  if (!signedUrls.trackSignedUrl) {
    // ?
    return;
  }

  return (
    <div className="h-full">
      <title>{track.title}</title>
      <div className="h-max bg-green-50/50 py-20">
        <div className="container mx-auto">
          <div className="flex items-center gap-x-8">
            <div>
              {signedUrls.imageSignedUrl ? (
                <Image
                  src={signedUrls.imageSignedUrl}
                  width={450}
                  height={450}
                  alt={`Обложка трека "${track.title}"`}
                  className="aspect-square rounded-lg object-cover shadow-xl shadow-primary/40"
                />
              ) : (
                <Skeleton className="size-[450px] rounded-md" />
              )}
            </div>
            <TrackPrimaryData
              track={track}
              audioFileSignedUrl={signedUrls.trackSignedUrl}
            />
          </div>
          <div className="mt-12 grid grid-cols-5">
            <div className="col-span-4">{track.description}</div>
            <TrackStats className="w-full items-start" track={track} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
