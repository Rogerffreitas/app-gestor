import { StrictBuilder } from "../../../services/StrictBuilder";
import HttpClientGateway from "../../application/gateways/HttpClientGateway";
import { AuthHttpResponse } from "../../entity/http/dtos/AuthHttpResponse";
import { HttpRequest } from "../../entity/http/dtos/HttpRequest";
import AuthServices from "../interfaces/AuthServices";

export class AuthServicesImpl implements AuthServices {
  private httpClientGateway: HttpClientGateway<AuthHttpResponse>;

  constructor(httpClientGateway: HttpClientGateway<AuthHttpResponse>) {
    this.httpClientGateway = httpClientGateway;
  }
  async loginByUsernameAndPassword(
    request: HttpRequest
  ): Promise<AuthHttpResponse> {
    console.log("teste");
    //return await this.httpClientGateway.httpRequestPost(request)
    return StrictBuilder<AuthHttpResponse>()
      .user({
        id: "5411d7d2",
        enterpriseId: "96d535819056",
        isValid: true,
        createdAt: 1756995113000,
        updatedAt: 1756995113000,
        username: "roger",
        role: "ADMIN",
        name: "Roger",
        email: "rogerf@outlook.com",
        profilePic: "default.png",
        isConnected: false,
      })
      .enterprise({ name: "empresa" })
      .token({
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.yIiOiJyb2dlcmZmcmVpdGFzIiwiZX.VvasrDzb-SRB6DvhMIQGfuozX4h6IzlJNOHsF7-jKm0",
        type: "Bearer",
      })
      .build();
  }
}
