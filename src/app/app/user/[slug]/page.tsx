import { getUserBySlug } from "@/actions/user";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import AvatarPlaceholder from "@/assets/avatar-placeholder.jpg";

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

  console.log(user);

  return (
    <div className="grid h-full grid-cols-5">
      <div className="col-span-4 py-2 pr-2">
        {user.tracks.map((track) => (
          <div key={track.id}>{track.title}</div>
        ))}
      </div>
      <div className="col-span-1 border-l py-2 pl-2">
        <div className="space-y-1">
          <Image
            src={AvatarPlaceholder}
            alt={"Аватар пользователя " + user.username}
            width={400}
            height={400}
            className="rounded-full"
            priority
          />
          <h1 className="text-center text-lg font-medium">{user.username}</h1>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
