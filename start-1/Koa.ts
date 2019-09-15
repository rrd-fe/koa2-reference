import http, { IncomingMessage, ServerResponse } from "http";

type noop = () => void;
interface middlewareFn {
  (req: IncomingMessage, res: ServerResponse): void;
}

class Koa {
  private middleware: middlewareFn = () => {};
  constructor() {}
  // step 1：add listen function to start a server
  listen(port: number, cb: noop) {
    const server = http.createServer((req, res) => {
      this.middleware(req, res);
    });
    return server.listen(port, cb);
  }
  // step 2: add use function to assign middleware function handle request
  use(middlewareFn: middlewareFn) {
    this.middleware = middlewareFn;
    return this;
  }
}

export default Koa;
