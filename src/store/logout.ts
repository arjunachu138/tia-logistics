import { createAction } from "@reduxjs/toolkit";
import { httpClient } from "../services/httpclient";

export const logout = createAction("app/logout");

export const clearSession = () => {
  httpClient.setAuthorizationToken("");
};
