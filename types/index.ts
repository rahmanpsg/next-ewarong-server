export type AuthState = {
  authenticated: boolean;
};

export type Users = {
  _id: string;
  nik: number;
  ktm: number;
  saldo: number;
  nama: string;
  telpon: number;
  alamat: string;
  aktif: boolean;
  createdAt: string;
};

export type AgenState = {
  agens: Array<Users>;
  message: string | null;
  error: boolean;
  errors: Map<string, string> | null;
};

export type UserState = {
  users: Array<Users>;
  message: string | null;
  error: boolean;
  errors: Map<string, string> | null;
};

export interface State {
  authState: AuthState;
  agenState: AgenState;
  userState: UserState;
}
