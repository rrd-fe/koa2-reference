import Koa from "./Koa";
import session from "./middleware/session";

const app = new Koa();

app.use(session());

app.use(async (context, next) => {
  console.log("middleware 1 start");
  context.session.visitTime = context.session.visitTime
    ? context.session.visitTime + 1
    : 1;
  // 获取query数据
  console.log(context.request.query);
  await next();
  console.log("middleware 1 end");
});

app.use(async (context, next) => {
  console.log("middleware 2 start");
  await next();
  console.log("middleware 2 end");
});

app.use(async (context, next) => {
  context.body = `欢迎第${context.session.visitTime}访问`;
  await next();
});

app.listen(3000, () => {
  console.log("Server listen on port 3000");
});

app.on("error", (error: Error, context) => {
  console.error(`请求${context.url}发生了错误，${error.message}`);
});
