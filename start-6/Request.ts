import { IncomingMessage } from "http";
import url from "url";

// query解析：url.parse、querystring模块、自己解析
interface Query {
  [key: string]: string | string[];
}

export default class KoaRequest {
  public req: IncomingMessage;
  private _query: Query;
  constructor(req: IncomingMessage) {
    this.req = req;
    this._query = this.req.url ? url.parse(this.req.url, true).query : {};
  }
  get url() {
    return this.req.url;
  }
  get query() {
    return this._query;
  }
}
