export interface UserModel{

    _id?: string;
    username: string;
    password?: string;
    email: string;
    userid?: number;
    roles: [];
    groups: [];

}

export interface GroupModel{

    _id?: string;
    groupName: string;
    admins: [];
    users: [];
}