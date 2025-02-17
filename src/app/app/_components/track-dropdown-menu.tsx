import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";
import { BASIC_API_URL } from "@/lib/consts";
import { request } from "@/lib/utils";
import { Pen } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const TrackDropdownMenu = ({ track }: { track: Track }) => {
  const { user } = useAuth();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteTrack = async () => {
    if (track.userId !== user?.id) {
      toast({
        title: "Ошибка!",
        description: "Вы не можете удалить данный трек. ",
      });
      return;
    }

    setIsDeleting(true);
    try {
      const client = await request();
      const response = await client.delete(BASIC_API_URL + "track/" + track.id);
      if (response.status === 204) {
        toast({ title: "Трек удалён!", variant: "success" });
        router.refresh();
        return;
      }

      switch (response.status) {
        case 401:
          toast({ title: "Ошибка авторизации", variant: "destructive" });
          return;
        case 403:
          toast({
            title: "Вы не можете удалить данный трек",
            variant: "destructive",
          });
          return;
        case 404:
          toast({ title: "Трек не найден!", variant: "destructive" });
          return;
        default:
          toast({
            title: "Ошибка!",
            description:
              "Возникла непредвиденная ошибка. Обновите страницу и попробуйте заново",
            variant: "destructive",
          });
          return;
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <Pen />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>{track.title}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Редактировать</DropdownMenuItem>
          <DropdownMenuItem disabled={!Boolean(track.isPublic)}>
            Поделиться
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild className="w-full">
            <AlertDialogTrigger>Удалить</AlertDialogTrigger>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
          <AlertDialogDescription>
            Вы хотите удалить трек "{track.title}". Это действие невозможно
            отменить
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Отмена</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteTrack}
            className="bg-red-500 text-white hover:bg-red-400"
          >
            Удалить
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default TrackDropdownMenu;
