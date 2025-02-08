enum UserRoles {
    User = 'User',
    Admin = 'Admin'
}

type User = {
    id: number;
    username: string;
    slug: string;
    email: string;
    role: UserRoles;
    bio?: string;
    avatarFilePath?: string;
    links: string[];
    password: string;
    createdAt: Date;
    updatedAt: Date;
};