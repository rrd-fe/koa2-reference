import { IncomingMessage, ServerResponse } from "http";
import KoaRequest from "./Request";
import KoaResponse from "./Response";
import Cookies from "./Cookies";

export default class KoaContext {
  public request: KoaRequest;
  public response: KoaResponse;
  public cookies: Cookies;

  constructor(req: IncomingMessage, res: ServerResponse) {
    this.request = new KoaRequest(req);
    this.response = new KoaResponse(res);
    this.cookies = new Cookies(this.request, this.response);
  }

  get url() {
    return this.request.url;
  }

  get body() {
    return this.response.body;
  }

  set body(bodyStr: string) {
    this.response.body = bodyStr;
  }
}
