import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: null,
  role: null,
  username: null,
  isAuthChecked: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { token, role, username } = action.payload;
      const expireTime = Date.now() + 1000 * 60 * 30; // 設定30分逾期登出

      state.token = token;
      state.role = role;
      state.username = username;
      state.isAuthChecked = true;
      localStorage.setItem('token_expire_at', expireTime.toString());
    },
    logout: (state) => {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('username');
      localStorage.removeItem('token_expire_at');

      state.token = null;
      state.role = null;
      state.isAuthChecked = true;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;

export const checkAuth = () => (dispatch) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const username = localStorage.getItem('username');
  const expireAt = Number(localStorage.getItem('token_expire_at'));
  const now = Date.now();

  if (token && role && expireAt && now < expireAt) {
    dispatch(setCredentials({ token, role, username }));
    localStorage.setItem('token_expire_at', (now + 1000 * 60 * 30).toString());
  } else {
    dispatch(logout());
  }
};