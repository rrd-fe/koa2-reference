import { ServerResponse } from "http";

export default class KoaResponse {
  public res: ServerResponse;
  private _body: string = "";
  constructor(res: ServerResponse) {
    this.res = res;
  }

  public get body() {
    return this._body;
  }

  public set body(bodyStr: string) {
    this._body = bodyStr;
  }
}
