import Koa from "./Koa";

const app = new Koa();

app.use(async (context, next) => {
  console.log("middleware 1 start");
  let visitTime = context.cookies.get("visitTime");
  if (visitTime) {
    visitTime =
      typeof visitTime === "string"
        ? Number.parseFloat(visitTime) + 1
        : visitTime + 1;
  } else {
    visitTime = 1;
  }
  context.cookies.set("visitTime", visitTime);
  await next();
  console.log("middleware 1 end");
});

app.use(async (context, next) => {
  console.log("middleware 2 start");
  await next();
  console.log("middleware 2 end");
});

app.use(async (context, next) => {
  context.body = `欢迎第${context.cookies.get("visitTime")}访问`;
  await next();
});

app.listen(3000, () => {
  console.log("Server listen on port 3000");
});

app.on("error", (error: Error, context) => {
  console.error(`请求${context.url}发生了错误，${error.message}`);
});
