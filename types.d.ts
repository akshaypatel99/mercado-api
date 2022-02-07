export type UserInfo = {
  _id: String
}

export type UserData = {
  _id: String;
  name: string;
  email: string;
  password: string;
  role: string;
}

declare global {
  namespace Express {
    export interface Request {
      user: any;
    }
    export interface Response {
      user: any;
    }
  }
}