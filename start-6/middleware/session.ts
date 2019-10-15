import KoaContext from "../Context";

type noop = () => void;

interface Session {
  [key: string]: any;
}

interface SessionStore {
  [key: string]: Session;
}

const SESSION_ID = "session_id";
const sessionStore: SessionStore = {};

function generateSession(): Session {
  const session: Session = {};
  session.id = new Date().getTime() + Math.random();
  session.expire = new Date().getTime() + 20 * 60 * 1000;
  sessionStore[session.id] = session;
  return session;
}

export default function() {
  return async function(ctx: KoaContext, next: noop) {
    const writeHead = ctx.response.res.writeHead;
    ctx.response.res.writeHead = function() {
      ctx.cookies.set(SESSION_ID, ctx.session.id);
      // @ts-ignore：无法被执行的代码的错误
      return writeHead.apply(this, arguments);
    };
    /**
     * 检查是否有 sessionId cookie
     *  没有： generateSession
     *  有：
     *      检查是否存在
     *          是
     *              检查是否过期
     *                  是：generateSession
     *                  否：延长过期时间
     *          否  generateSession
     */
    const sessionId = ctx.cookies.get(SESSION_ID);
    if (sessionId) {
      let session = sessionStore[sessionId];
      if (session) {
        // 没有过期，延长时间
        if (session.expire > new Date().getTime()) {
          session.expire = new Date().getTime() + 20 * 60 * 1000;
          // 没来一个请求从sessionStore还原session
          ctx.session = session;
        } else {
          delete sessionStore[sessionId];
          const newSession = generateSession();
          ctx.session = newSession;
        }
      } else {
        session = generateSession();
        ctx.session = session;
      }
    } else {
      const session = generateSession();
      ctx.session = session;
    }
    await next();
  };
}
