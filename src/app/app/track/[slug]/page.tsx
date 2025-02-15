import { getTrackBySlug } from "@/actions/track";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

type TrackPageParams = {
  slug: string;
};

const Page = async ({ params }: { params: TrackPageParams }) => {
  const { slug } = await params;
  const result = await getTrackBySlug(slug);

  if (!result.ok || !result.track) {
    switch (result.status) {
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

  return (
    <div>
      <h1>{result.track.title}</h1>
    </div>
  );
};

export default Page;
