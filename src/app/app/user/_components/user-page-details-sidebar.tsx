"use client";

import AvatarPlaceholder from "@/assets/avatar-placeholder.jpg";
import Image from "next/image";
import { useAuth } from "@/hooks/use-auth";
import { LoaderCircle, UserRoundMinus, UserRoundPlus } from "lucide-react";
import SubscribeButton from "./subscribe-button";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { BASIC_API_URL } from "@/lib/consts";
import { toast } from "@/hooks/use-toast";
import UnsubscribeButton from "./unsubscrube-button";
import { useRouter } from "next/navigation";
import { request } from "@/actions/auth";

const UserPageDetailsSidebar = ({ user }: { user: User }) => {
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const [subscribers, setSubscribers] = useState<User[]>([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [isSubscribersFetched, setIsSubscribersFetched] = useState(false);

  useEffect(() => {
    subscribers.forEach((u) => {
      if (u.id === currentUser?.id) {
        setIsSubscribed(true);
        return;
      }

      setIsSubscribed(false);
    });
  }, [subscribers]);

  useEffect(() => {
    if (user.id === currentUser?.id) {
      setIsCurrentUser(true);
    }
  }, [user, currentUser]);

  useEffect(() => {
    const getData = async () => {
      try {
        const route = BASIC_API_URL + "subscription/" + user.id;
        const client = await request();
        const response = await client<User[]>(route);

        console.log(response);
        if (response.status !== 200) {
          if (response.status === 404) {
            toast({
              title: "Ошибка!",
              description: "Пользователь не найден",
              variant: "destructive",
            });
            return;
          }

          toast({
            title: "Ошибка!",
            description: "Не удалось получить список подписчиков",
            variant: "destructive",
          });
          return;
        }

        setSubscribers(response.data);
      } catch (e) {
        console.log(e);
      } finally {
        setIsSubscribersFetched(true);
      }
    };

    getData();
  }, []);

  return (
    <aside className="col-span-1 border-l py-2 pl-2">
      <Image
        src={AvatarPlaceholder}
        width={300}
        height={300}
        alt={"Аватар пользователя " + user?.username}
        className="rounded-full"
      />
      <div className="flex items-center justify-center gap-x-2">
        <h1 className="my-2 text-center text-xl font-medium">
          {user?.username}
        </h1>

        {isCurrentUser ? null : isSubscribed ? (
          <UnsubscribeButton
            after={() => {
              router.refresh();
              let newSubscribers = subscribers;
              newSubscribers.shift();
              setSubscribers(newSubscribers);
              setIsSubscribed(false);
            }}
            userToBeUnsubscribedFromId={user.id}
            userToBeUnsubscribedFromName={user.username}
            variant="ghost"
            size="icon"
            className="size-8 rounded-full hover:bg-red-500 hover:text-white"
            title={"Отписаться от " + user.username}
          >
            <UserRoundMinus />
          </UnsubscribeButton>
        ) : (
          <SubscribeButton
            userToBeSubscribedToId={user.id}
            userToBeSubscribedToName={user.username}
            size="icon"
            className="size-8 rounded-full"
            title={"Подписаться на " + user.username}
          >
            <UserRoundPlus />
          </SubscribeButton>
        )}
      </div>
      <div className="mx-auto w-fit">
        <div className="inline-flex w-fit items-center gap-x-1 text-sm font-medium">
          {isSubscribersFetched ? (
            subscribers.length
          ) : (
            <LoaderCircle className="size-4 animate-spin" />
          )}
          <span>Подписчиков</span>
        </div>
      </div>
    </aside>
  );
};

export default UserPageDetailsSidebar;
