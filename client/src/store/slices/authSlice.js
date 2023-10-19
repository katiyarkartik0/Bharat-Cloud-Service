import { createSlice } from "@reduxjs/toolkit";
import { PURGE } from "redux-persist";

const initialState = {
  userData: null,
  accessToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLogin: (state, action) => {
      const {userData,accessToken} = action.payload
      state.userData = userData;
      state.accessToken = accessToken;
    },
    setLogout: (state, action) => {
      state.userData = null;
      state.accessToken = null;
    },
  },
  extraReducers(builder) {
    builder.addCase(PURGE, () => {
      return initialState;
    });
  },
});

export const { setLogin, setLogout } = authSlice.actions;
export default authSlice.reducer;
