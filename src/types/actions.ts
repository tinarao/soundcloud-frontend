type ActionResponse = {
  ok: boolean;
  status: number;
  message?: string;
};

type LoginDTO = {
  email: string;
  password: string;
};

type RegisterDTO = {
  username: string;
  email: string;
  password: string;
};

type UploadTrackDTO = {
  artworkFile: File;
  audioFile: File;
  genres: string[];
  title: string;
  description: string;
};
