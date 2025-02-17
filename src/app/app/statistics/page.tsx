import { me } from "@/actions/auth";
import { redirect } from "next/navigation";
import PageSubHeader from "../_components/page-sub-header";
import { request } from "@/lib/utils";
import { BASIC_API_URL } from "@/lib/consts";
import { Ear, Heart, Music, UserCheck } from "lucide-react";

const StatisticsPage = async () => {
  const user = await me();
  if (!user) {
    return redirect("/login");
  }

  const client = await request();
  const response = await client.get<UserStatisticDTO>(
    BASIC_API_URL + "user/stats",
  );

  const stats = response.data;

  return (
    <div>
      <PageSubHeader>Статистика</PageSubHeader>
      <div className="space-y-3">
        <div className="grid grid-cols-4 gap-2">
          <div className="flex h-48 flex-col items-center justify-center rounded-md border-2 shadow-sm transition hover:border-green-200 hover:shadow-md">
            <h4 className="text-4xl font-bold">{stats.tracksCount}</h4>
            <p className="flex items-center gap-x-1">
              <Music className="size-4" /> Треки
            </p>
          </div>
          <div className="flex h-48 flex-col items-center justify-center rounded-md border-2 shadow-sm transition hover:border-green-200 hover:shadow-md">
            <h4 className="text-4xl font-bold">{stats.subscribersCount}</h4>
            <p className="flex items-center gap-x-1">
              <UserCheck className="size-4" /> Подписчики
            </p>
          </div>
          <div className="flex h-48 flex-col items-center justify-center rounded-md border-2 shadow-sm transition hover:border-green-200 hover:shadow-md">
            <h4 className="text-4xl font-bold">{stats.overallListens}</h4>
            <p className="flex items-center gap-x-1">
              <Ear className="size-4" /> Прослушивания
            </p>
          </div>
          <div className="flex h-48 flex-col items-center justify-center rounded-md border-2 shadow-sm transition hover:border-green-200 hover:shadow-md">
            <h4 className="text-4xl font-bold">{stats.overallLikes}</h4>
            <p className="flex items-center gap-x-1">
              <Heart className="size-4" /> Лайки
            </p>
          </div>
        </div>
        <div className="">
          <p>Публичных треков: {stats.publicTracksCount}</p>
          <p>Лайков на трек: {stats.likesPerTrack}</p>
          <p>Лайков на прослушивание: {stats.likesPerListen}</p>
          <p>Лайков на подписчика: {stats.likesPerSubscriber}</p>
          <p>Прослушиваний на трек: {stats.listensPerTrack}</p>
          <p>Прослушиваний на подписчика: {stats.listensPerSubscriber}</p>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;
