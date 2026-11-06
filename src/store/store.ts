import {
  combineReducers,
  configureStore,
  type AnyAction,
} from "@reduxjs/toolkit";
import { clearSession, logout } from "./logout";
import userReducer from "./user/userSlice";

const appReducer = combineReducers({
  user: userReducer,
});

const rootReducer = (
  state: ReturnType<typeof appReducer> | undefined,
  action: AnyAction,
) => {
  if (action.type === logout.type) {
    clearSession();
    return appReducer(undefined, action);
  }

  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
});

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
