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
  createdAt: Date;
  updatedAt: Date;
};

type UserWithTracks = User & { tracks: Track[] };
