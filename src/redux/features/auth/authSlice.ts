import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IUserPayload {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  avatar?: string | null;
}

export interface AuthState {
  user: null | IUserPayload;
  token: null | string;
}

const getInitialState = (): AuthState => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    const userStr = localStorage.getItem('user');
    let user = null;
    if (userStr) {
      try {
        user = JSON.parse(userStr);
      } catch (e) {
        user = null;
      }
    }
    return { token, user };
  }
  return { token: null, user: null };
};

const initialState: AuthState = getInitialState();

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{
        user: IUserPayload;
        token?: string;
      }>
    ) => {
      const { user, token } = action.payload;
      state.user = user;
      if (token) {
        state.token = token;
      }
      if (typeof window !== 'undefined') {
        if (token) {
          localStorage.setItem('accessToken', token);
        }
        localStorage.setItem('user', JSON.stringify(user));
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      }
    },
  },
});

export const { setUser, logout } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentToken = (state: { auth: AuthState }) => state.auth.token;
export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user;
