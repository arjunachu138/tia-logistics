import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { LoginResponse } from "../../shared/types";

interface UserState {
  userDetails: LoginResponse | null;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  userDetails: null,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserDetails: (state, action: PayloadAction<LoginResponse>) => {
      state.userDetails = action.payload;
      state.isAuthenticated = true;
    },
  },
});

export const { setUserDetails } = userSlice.actions;

export default userSlice.reducer;
