import http, { IncomingMessage, ServerResponse } from "http";

interface KoaRequest {
  req?: IncomingMessage;
  url: String | undefined;
}

const request: KoaRequest = {
  get url() {
    return this.req!.url;
  }
};

interface KoaResponse {
  res?: ServerResponse;
  body: String | null;
}

const response: KoaResponse = {
  body: null
};

interface KoaContext {
  request?: KoaRequest;
  response?: KoaResponse;
  body: String | null;
  url: String | undefined;
}
const context: KoaContext = {
  get url() {
    return this.request!.url;
  },
  get body() {
    return this.response!.body;
  },
  set body(body) {
    this.response!.body = body;
  }
};

type noop = () => void;
interface middlewareFn {
  (context: KoaContext, next: noop): void;
}

/**
 * step 3 : compose middleware
 * make middlewares array serial call
 * @param middlewares
 */
function composeMiddleware(middlewares: middlewareFn[]) {
  return (context: KoaContext) => {
    let start = -1;
    function dispatch(i: number) {
      // second time call next i === start, normally i alway bigger than start
      if (i <= start) {
        return Promise.reject(new Error("next() call more than once!"));
      }
      if (i >= middlewares.length) {
        return Promise.resolve();
      }
      start = i;
      const middleware = middlewares[i];
      middleware(context, () => {
        return dispatch(i + 1);
      });
    }
    return dispatch(0);
  };
}

class Koa {
  private middlewares: middlewareFn[] = [];
  private context: KoaContext = Object.create(context);
  private request = Object.create(request);
  private response = Object.create(response);
  constructor() {}
  // step 1：add listen function to start a server
  listen(port: number, cb: noop) {
    const fn = composeMiddleware(this.middlewares);
    const server = http.createServer(async (req, res) => {
      const context = this.createContext(req, res);
      await fn(context);
      if (context.response && context.response.res) {
        context.response.res.writeHead(200);
        context.response.res.end(context.body);
      }
    });
    return server.listen(port, cb);
  }
  // step 2: add use function to assign middleware function handle request
  use(middlewareFn: middlewareFn) {
    this.middlewares.push(middlewareFn);
    return this;
  }
  // step 4: add context replace request and response
  createContext(req: IncomingMessage, res: ServerResponse): KoaContext {
    const request = Object.create(this.request);
    const response = Object.create(this.response);
    const context = Object.create(this.context);
    request.req = req;
    response.res = res;
    context.request = request;
    context.response = response;
    return context;
  }
}

export default Koa;
