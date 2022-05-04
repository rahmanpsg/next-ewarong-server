export type AuthState = {
  authenticated: boolean;
};

export interface State {
  authState: AuthState;
}
