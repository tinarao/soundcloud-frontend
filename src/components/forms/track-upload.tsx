"use client";

import axios, { AxiosInstance } from "axios";
import { useRef, useState, useTransition } from "react";
import { useForm } from "@tanstack/react-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { BASIC_API_URL } from "@/lib/consts";
import { useRouter } from "next/navigation";
import { request } from "@/actions/auth";
import { uploadTrack } from "@/actions/track";

const UploadTrackForm = () => {
  const router = useRouter();
  const [genres, setGenres] = useState<string[]>([]);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [artworkFile, setArtworkFile] = useState<File | null>(null);
  const [isLoading, startTransition] = useTransition();
  const genreInputRef = useRef<HTMLInputElement>(null);

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
    },
    onSubmit: async ({ value }) => {
      if (!artworkFile) {
        toast({ title: "Вы не выбрали обложку!", variant: "destructive" });
        return;
      }

      if (!audioFile) {
        toast({ title: "Вы не выбрали трек!", variant: "destructive" });
        return;
      }

      const data = {
        ...value,
        artworkFile,
        audioFile,
        genres,
      };

      const result = await uploadTrack(data);
      if (!result.ok) {
        toast({ title: result.message });
        return;
      }

      toast({ title: "Трек успешно загружен!" });
      router.replace("/app/track/" + result.slug);
      return;
    },
  });

  return (
    <>
      {audioFile ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className={cn(
            "grid w-[48rem] space-y-2",
            artworkFile ? "w-[48rem] grid-cols-2" : "w-[24rem] grid-cols-1",
          )}
        >
          <div className="space-y-2">
            <div>
              <form.Field name="title">
                {(field) => (
                  <>
                    <Label>
                      Название
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      required
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </>
                )}
              </form.Field>
            </div>
            <div>
              <form.Field name="description">
                {(field) => (
                  <>
                    <Label>Описание</Label>
                    <Textarea
                      rows={6}
                      maxLength={600}
                      className="resize-none"
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </>
                )}
              </form.Field>
            </div>
            <div>
              <Label>Обложка</Label>
              <Input
                type="file"
                accept=".jpeg, .jpg, .png"
                multiple={false}
                onChange={(e) => {
                  if (!e.currentTarget.files) return;
                  const file_ = e.currentTarget.files[0];
                  const size = parseFloat(
                    (file_.size / 1024 / 1024).toFixed(2),
                  );
                  if (size > 2) {
                    e.currentTarget.value = "";
                    toast({
                      title: `Размер обложки не должен превышать ${20} Мб.`,
                      variant: "destructive",
                    });
                    return;
                  }

                  setArtworkFile(file_);
                }}
              />
            </div>
            <div>
              <Label>
                Жанры<span className="text-red-500">*</span>
              </Label>
              <div className="flex items-center">
                <Input
                  disabled={genres.length === 5}
                  placeholder="Dubstep, Hip-hop"
                  className="rounded-r-none"
                  ref={genreInputRef}
                />
                <Button
                  disabled={genres.length === 5}
                  size="icon"
                  type="button"
                  className="rounded-l-none"
                  onClick={() => {
                    if (!genreInputRef.current) return;
                    let newGenre = genreInputRef.current.value;
                    let newGenresArr: string[] = [...genres];
                    if (genres.includes(newGenre) || newGenre.length < 1) {
                      return;
                    }

                    newGenresArr.push(newGenre);
                    genreInputRef.current.value = "";
                    setGenres(newGenresArr);
                  }}
                >
                  +
                </Button>
              </div>

              <div className="flex items-center gap-2 pt-2">
                {genres.map((g) => (
                  <div
                    className="rounded-full bg-primary px-1.5 py-0.5 text-sm font-medium text-white"
                    key={g}
                  >
                    <span>{g}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Button
                disabled={
                  form.state.isSubmitting ||
                  genres.length === 0 ||
                  genres.length > 5
                }
                type="submit"
              >
                Сохранить
              </Button>
            </div>
          </div>
          {artworkFile && (
            <div className="ml-4">
              <img
                className="aspect-square h-full rounded-md object-cover"
                src={URL.createObjectURL(artworkFile)}
                alt="Выбранная обложка"
              />
            </div>
          )}
        </form>
      ) : (
        <div>
          <Label>Выберите аудио-файл</Label>
          <Input
            type="file"
            accept=".mp3"
            onChange={(e) => {
              if (!e.currentTarget.files) return;
              const file_ = e.currentTarget.files[0];
              const size = parseFloat((file_.size / 1024 / 1024).toFixed(2));
              if (size > 20) {
                e.currentTarget.value = "";
                toast({
                  title: `Размер аудиофайла не должен превышать ${20} Мб.`,
                  variant: "destructive",
                });
                return;
              }

              setAudioFile(file_);
            }}
          />
        </div>
      )}
    </>
  );
};

export default UploadTrackForm;
