export enum Roles {
    ADMIN = "admin",
    USER = "user"
}

export interface UserData {
    loggedIn: boolean;

    // roles: Roles[]
    avatar: string;
    id: string;
    name: string;
}