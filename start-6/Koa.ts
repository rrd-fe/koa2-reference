import { EventEmitter } from "events";
import http from "http";
import KoaContext from "./Context";

type noop = () => void;
interface middlewareFn {
  (context: KoaContext, next: noop): any;
}

/**
 * step 3 : compose middleware
 * make middlewares array serial call
 * @param middlewares
 */
function composeMiddleware(middlewares: middlewareFn[]) {
  return (context: KoaContext) => {
    let start = -1;
    function dispatch(i: number): Promise<any> {
      // second time call next i === start, normally i alway bigger than start
      if (i <= start) {
        return Promise.reject(new Error("next() call more than once!"));
      }
      if (i >= middlewares.length) {
        return Promise.resolve();
      }
      start = i;
      const middleware = middlewares[i];
      return middleware(context, () => {
        return dispatch(i + 1);
      });
    }
    return dispatch(0);
  };
}

class Koa extends EventEmitter {
  private middlewares: middlewareFn[] = [];
  constructor() {
    super();
  }
  // step 1：add listen function to start a server
  listen(port: number, cb: noop) {
    const fn = composeMiddleware(this.middlewares);
    const server = http.createServer(async (req, res) => {
      const context = new KoaContext(req, res);
      // step 5: emit error event support errorListener
      try {
        await fn(context);
        if (context.response && context.response.res) {
          context.response.res.writeHead(200);
          context.response.res.end(context.body);
        }
      } catch (error) {
        console.error("Server Error");
        this.emit("error", error, context);
      }
    });
    return server.listen(port, cb);
  }
  // step 2: add use function to assign middleware function handle request
  use(middlewareFn: middlewareFn) {
    this.middlewares.push(middlewareFn);
    return this;
  }
  onError(error: Error) {
    console.error(error);
  }
}

export default Koa;
