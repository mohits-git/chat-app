import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface UserState {
  _id: string;
  name: string;
  email: string;
  profile_pic: string;
  token: string;
}
const initialState: UserState = {
  _id: '',
  name: '',
  email: '',
  profile_pic: '',
  token: '',
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
    }
  }
});

export const { setUser, setToken, logout } = userSlice.actions;
export default userSlice.reducer;
