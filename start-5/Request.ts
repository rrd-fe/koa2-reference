import { IncomingMessage } from "http";

export default class KoaRequest {
  public req: IncomingMessage;
  constructor(req: IncomingMessage) {
    this.req = req;
  }
  get url() {
    return this.req.url;
  }
}
