"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAuth } from "@/hooks/use-auth";
import {
  BookAudio,
  CassetteTape,
  ChartSpline,
  Cog,
  LoaderCircle,
  LogOut,
  Upload,
  User,
} from "lucide-react";
import Link from "next/link";

const UserPopover = () => {
  const { user } = useAuth();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          {user ? user?.username : <LoaderCircle className="animate-spin" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 space-y-1 rounded-lg bg-white p-2 shadow-lg *:w-full *:justify-start">
        <Button variant="ghost" asChild>
          <Link href={"/app/user/" + user?.slug}>
            <User />
            Мой профиль
          </Link>
        </Button>
        <Button variant="ghost">
          <BookAudio />
          Любимые треки
        </Button>
        <Button variant="ghost">
          <CassetteTape />
          Плейлисты
        </Button>
        <Button variant="ghost" asChild>
          <Link href="/app/statistics">
            <ChartSpline /> Статистика
          </Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link href="/app/settings">
            <Cog /> Настройки
          </Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link href="/upload" target="_blank">
            <Upload />
            Загрузить трек
          </Link>
        </Button>
        <hr />
        <Button
          variant="ghost"
          className="hover:bg-red-500 hover:text-white"
          asChild
        >
          <Link href="/logout">
            <LogOut />
            Выйти
          </Link>
        </Button>
      </PopoverContent>
    </Popover>
  );
};

export default UserPopover;
