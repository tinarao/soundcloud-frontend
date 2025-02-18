enum UserRoles {
  User = "User",
  Admin = "Admin",
}

type User = {
  id: number;
  username: string;
  slug: string;
  email: string;
  role: UserRoles;
  bio?: string;
  avatarFilePath?: string;
  bannerFilePath?: string;
  links: string[];
  createdAt: string;
};

type UserStatisticDTO = {
  overallLikes: number;
  overallListens: number;
  tracksCount: number;
  subscribersCount: number;

  publicTracksCount: number;
  likesPerListen: number;
  likesPerTrack: number;
  listensPerTrack: number;
  likesPerSubscriber: number;
  listensPerSubscriber: number;
};

type UserWithTracks = User & { tracks: Track[] };
