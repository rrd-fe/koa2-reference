import Koa from "./Koa";

const app = new Koa();

app.use(async (context, next) => {
  console.log("middleware 1 start");
  await next();
  console.log("middleware 1 end");
});

app.use(async (context, next) => {
  console.log("middleware 2 start");
  // throw new Error("出错了");
  await next();
  console.log("middleware 2 end");
});

app.use(async (context, next) => {
  context.body = "An request come in";
  await next();
});

app.listen(3000, () => {
  console.log("Server listen on port 3000");
});

app.on("error", (error, context) => {
  console.error(`请求${context.url}发生了错误`);
});
