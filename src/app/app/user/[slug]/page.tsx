import { getUserBySlug } from "@/actions/user";
import { Button } from "@/components/ui/button";
import UserPageDetailsSidebar from "../_components/user-page-details-sidebar";
import { ACCESS_TOKEN_NAME, BASIC_API_URL } from "@/lib/consts";
import TrackBlock from "../../_components/track-block";
import { request } from "@/lib/utils";
import { cookies } from "next/headers";

type UserPageProps = {
  params: {
    slug: string;
  };
};

const getTracksByUserSlug = async (slug: string): Promise<Track[]> => {
  const route = BASIC_API_URL + "track/by-user/" + slug;
  const client = await request();
  const response = await client<Track[]>(route);
  if (response.status !== 200) {
    return [];
  }

  return response.data;
};

const UserPage = async ({ params }: UserPageProps) => {
  const { slug } = await params;

  const [user, tracks] = await Promise.all([
    getUserBySlug(slug),
    getTracksByUserSlug(slug),
  ]);

  if (!user) {
    return (
      <div className="flex h-full flex-col items-center justify-center space-y-2">
        <h1 className="text-2xl">Пользователь не найден!</h1>
        <Button>Вернуться на главную страницу</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto grid h-full grid-cols-5">
      <div className="col-span-4 space-y-4 py-2 pr-2">
        {tracks.map((track) => (
          <TrackBlock key={track.id} track={track} author={user} />
        ))}
      </div>
      <UserPageDetailsSidebar user={user} />
    </div>
  );
};

export default UserPage;
