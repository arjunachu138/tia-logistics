import { NON_RETAIL_API_ENDPOINTS, RETAIL_API_ENDPOINTS } from "../api";
import { HTTP_METHODS } from "../api/httpmethods";
import type { LoginPayload, LoginResponse } from "../shared/types";
import { httpClient } from "./httpclient";

class AuthService {
  async nonRetailLogin(payload: LoginPayload): Promise<LoginResponse> {
    console.log("login non retail");

    const url = NON_RETAIL_API_ENDPOINTS.USER_LOGIN;
    const response = await httpClient.apihelper(
      HTTP_METHODS.POST,
      url,
      false,
      payload,
    );
    return response;
  }
  async retailLogin(payload: LoginPayload): Promise<LoginResponse> {
    console.log("login retail");

    const url = RETAIL_API_ENDPOINTS.USER_LOGIN;
    const response = await httpClient.apihelper(
      HTTP_METHODS.POST,
      url,
      false,
      payload,
    );
    return response;
  }
  async login(payload: LoginPayload): Promise<LoginResponse> {
    const nonRetailResponse = await this.nonRetailLogin(payload);
    console.log(nonRetailResponse);

    const isEDI = nonRetailResponse.settings?.[0]?.isEDIDb ?? false;

    if (isEDI === true) {
      return await this.retailLogin(payload);
    }

    return nonRetailResponse;
  }
}

export const authService = new AuthService();
