"use client";

import { removeSubscription } from "@/actions/subscription";
import { Button, ButtonProps } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { PropsWithChildren, RefAttributes, useTransition } from "react";

type SBProps = {
  userToBeUnsubscribedFromId: number;
  userToBeUnsubscribedFromName: string;

  after?: () => void;
};

const UnsubscribeButton = ({
  userToBeUnsubscribedFromId,
  userToBeUnsubscribedFromName,
  children,
  after,
  ...props
}: PropsWithChildren<
  SBProps & ButtonProps & RefAttributes<HTMLButtonElement>
>) => {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, startTransition] = useTransition();

  const handleRemoveSubscription = async () => {
    if (!user) {
      router.replace("/logout"); // why not? anyway unreachable
      return;
    }

    if (user.id === userToBeUnsubscribedFromId) {
      toast({
        title: "Ошибка!",
        description: "Вы не можете отписаться от себя",
      });
      return;
    }

    startTransition(async () => {
      const response = await removeSubscription(userToBeUnsubscribedFromId);
      if (!response.ok) {
        toast({
          title: "Ошибка!",
          description: response.message,
          variant: "destructive",
        });
        return;
      }
    });

    if (after) {
      after();
    }

    toast({
      title: "Успешно!",
      description: `Вы отписались от ${userToBeUnsubscribedFromName}`,
      variant: "success",
    });
    return;
  };

  return (
    <Button disabled={isLoading} onClick={handleRemoveSubscription} {...props}>
      {isLoading ? <LoaderCircle className="size-4 animate-spin" /> : children}
    </Button>
  );
};

export default UnsubscribeButton;
