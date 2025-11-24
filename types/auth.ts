
type UserSignIn = {
    email: string;
    password: string;
}
type UserSignUp = UserSignIn & {
    username: string;
    fullname: string;
};
type jwtPayload = {
    userId: number;
    email: string;
};

export type { UserSignIn, UserSignUp, jwtPayload };