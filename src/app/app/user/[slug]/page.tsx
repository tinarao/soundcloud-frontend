import { getUserBySlug } from "@/actions/user";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import AvatarPlaceholder from "@/assets/avatar-placeholder.jpg";
import UserPageDetailsSidebar from "../_components/user-page-details-sidebar";

type UserPageProps = {
  params: {
    slug: string;
  };
};

const UserPage = async ({ params }: UserPageProps) => {
  const { slug } = await params;

  const user = await getUserBySlug(slug);
  if (!user) {
    return (
      <div className="flex h-full flex-col items-center justify-center space-y-2">
        <h1 className="text-2xl">Пользователь не найден!</h1>
        <Button>Вернуться на главную страницу</Button>
      </div>
    );
  }

  return (
    <div className="grid h-full grid-cols-5">
      <div className="col-span-4 py-2 pr-2">
        {user.tracks.map((track) => (
          <div key={track.id}>{track.title}</div>
        ))}
      </div>
      <UserPageDetailsSidebar user={user} />
    </div>
  );
};

export default UserPage;
