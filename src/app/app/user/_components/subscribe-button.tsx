"use client";

import { createSubscription } from "@/actions/subscription";
import { Button, ButtonProps } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { PropsWithChildren, RefAttributes, useTransition } from "react";

type SBProps = {
  userToBeSubscribedToId: number;
  userToBeSubscribedToName: string;
};

const SubscribeButton = ({
  userToBeSubscribedToId,
  userToBeSubscribedToName,
  children,
  ...props
}: PropsWithChildren<
  SBProps & ButtonProps & RefAttributes<HTMLButtonElement>
>) => {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, startTransition] = useTransition();

  const handleCreateSubscription = async () => {
    if (!user) {
      router.replace("/logout"); // why not? anyway unreachable
      return;
    }

    if (user.id === userToBeSubscribedToId) {
      toast({
        title: "Ошибка!",
        description: "Вы не можете подписаться на себя",
      });
      return;
    }

    startTransition(async () => {
      const response = await createSubscription(userToBeSubscribedToId);
      if (!response.ok) {
        toast({
          title: "Ошибка!",
          description: response.message,
          variant: "destructive",
        });
        return;
      }
    });

    router.refresh();

    toast({
      title: "Успешно!",
      description: `Вы подписались на ${userToBeSubscribedToName}`,
      variant: "success",
    });
    return;
  };

  return (
    <Button disabled={isLoading} onClick={handleCreateSubscription} {...props}>
      {isLoading ? <LoaderCircle className="size-4 animate-spin" /> : children}
    </Button>
  );
};

export default SubscribeButton;
