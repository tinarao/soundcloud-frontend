type Track = {
  id: number;
  title: string;
  slug: string;
  description?: string;
  genres: string[];
  audioFilePath: string;
  imageFilePath: string;
  isPublic: boolean;
  isDownloadsEnabled: boolean;
  peaks: number[];
  duration: number;
  listens: number;
  likes: number;

  userId: number;
  user?: User;
};
