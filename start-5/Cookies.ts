import KoaRequest from "./Request";
import KoaResponse from "./Response";

interface CookieObj {
  [key: string]: string;
}

interface CookieOption {
  domain?: string;
  expires?: string;
  path?: string;
  httpOnly?: boolean;
  secure?: boolean;
}

export default class Cookies {
  private koaReq: KoaRequest;
  private koaRes: KoaResponse;
  private cookies: CookieObj;

  constructor(req: KoaRequest, res: KoaResponse) {
    this.koaReq = req;
    this.koaRes = res;
    this.cookies = this.parseCookie(this.koaReq.req.headers["cookie"]);
  }

  private parseCookie(cookieStr: string | undefined): CookieObj {
    const cookieObj: CookieObj = {};
    if (cookieStr && cookieStr !== "") {
      const cookies = cookieStr.split(";");
      for (var i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        if (cookie !== "") {
          const cookieToken = cookie.split("=");
          // 需要trim，否则会有空格
          cookieObj[cookieToken[0].trim()] = cookieToken[1];
        }
      }
    }
    return cookieObj;
  }

  private serializeCookie(
    name: string,
    value: string | number,
    options?: CookieOption
  ): string {
    const cookie = [`${name}=${value}`];
    if (options) {
      if (options.domain) {
        cookie.push(`Domain=${options.domain}`);
      }
      if (options.path) {
        cookie.push(`Path=${options.path}`);
      }
      if (options.expires) {
        cookie.push(`Expire=${options.expires}`);
      }
      if (options.httpOnly) {
        cookie.push(`HttpOnly`);
      }
    }
    return cookie.join(";");
  }

  get(name: string): string | undefined | number {
    return this.cookies[name];
  }

  getAll() {
    return this.cookies;
  }

  set(name: string, value: string | number, options?: CookieOption) {
    let rawCookies = this.koaRes.res.getHeader("Set-Cookie");
    let cookies: string[] = [this.serializeCookie(name, value, options)];
    if (Array.isArray(rawCookies)) {
      cookies.concat(rawCookies);
    } else if (typeof rawCookies === "string") {
      cookies.push(rawCookies);
    }
    this.koaRes.res.setHeader("Set-Cookie", cookies);
  }
}
