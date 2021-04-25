export interface IUser {
  uuid: string;

  username: string;

  firstname: string;

  lastname: string;

  password: string;

  createAt: Date;

}

export type TUserCreate = Omit<IUser, 'uuid' | 'createAt'>

export type JwtUserPayload = Omit<IUser, 'password' | 'createAt'> & {
  iat: number;
  exp: number;
}
