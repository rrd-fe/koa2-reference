import http, { IncomingMessage, ServerResponse } from "http";

type noop = () => void;
interface middlewareFn {
  (req: IncomingMessage, res: ServerResponse, next: noop): void;
}

/**
 * step 3 : compose middleware
 * make middlewares array serial call
 * @param middlewares
 */
function composeMiddleware(middlewares: middlewareFn[]) {
  return (req: IncomingMessage, res: ServerResponse) => {
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
      middleware(req, res, () => {
        dispatch(i + 1);
      });
    }
    dispatch(0);
  };
}

class Koa {
  private middlewares: middlewareFn[] = [];
  constructor() {}
  // step 1：add listen function to start a server
  listen(port: number, cb: noop) {
    const server = http.createServer(async (req, res) => {
      const fn = composeMiddleware(this.middlewares);
      await fn(req, res);
    });
    return server.listen(port, cb);
  }
  // step 2: add use function to assign middleware function handle request
  use(middlewareFn: middlewareFn) {
    this.middlewares.push(middlewareFn);
    return this;
  }
}

export default Koa;
