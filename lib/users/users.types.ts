export type UserResponse = UserBasic | UserDetail

interface UserBasic {
    id: string;
    name: string;
    email: string;
    pictureUrl: string;
    roles: string[];
}

interface UserDetail extends UserBasic {
    oauthProvider: string;
    employeeId: string;
    enabled: boolean;
    accountNonExpired: boolean;
    accountNonLocked: boolean;
    credentialsNonExpired: boolean;
    active: boolean;
}