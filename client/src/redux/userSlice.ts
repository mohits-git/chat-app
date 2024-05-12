import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import type { Socket } from "socket.io-client";

export interface UserState {
  _id: string;
  name: string;
  email: string;
  profile_pic: string;
  token: string;
}
export interface SocketState {
  socketConnection: null | Socket;
  onlineUsers: string[];
}
const initialState: UserState & SocketState = {
  _id: '',
  name: '',
  email: '',
  profile_pic: '',
  token: '',
  socketConnection: null,
  onlineUsers: [],
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<Omit<UserState, 'token'>>) => {
      state._id = action.payload._id;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.profile_pic = action.payload.profile_pic;
    },
    setToken: (state, action: PayloadAction<Pick<UserState, 'token'>>) => {
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.token = '';
      state._id = '';
      state.name = '';
      state.email = '';
      state.profile_pic = '';
      localStorage.removeItem('token');
      state.socketConnection = null;
    },
    setOnlineUsers: (state, action: PayloadAction<string[]>) => {
      state.onlineUsers = action.payload;
    },
    setSocketConnection: (state, action) => {
      state.socketConnection = action.payload;
    }
  }
});

export const { setUser, setToken, logout, setOnlineUsers, setSocketConnection } = userSlice.actions;
export default userSlice.reducer;
