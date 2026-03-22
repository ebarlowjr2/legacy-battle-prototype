export type AuthUser = {
  id: string;
  email?: string;
};

export type UserData = AuthUser;

export type SessionSnapshot = {
  user: AuthUser | null;
  accessToken: string | null;
};

export type SignUpParams = { email: string; password: string };
export type SignInParams = { email: string; password: string };
