export interface UserModel{

    _id?: string;
    username: string;
    password?: string;
    email: string;
    userid?: number;
    roles: string[];
    groups: string[];
    profilePicture?: string;
}

export interface GroupModel{

    _id?: string;
    groupName: string;
    admins: string[];
    users: string[];
}