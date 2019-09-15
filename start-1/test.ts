import Koa from "./Koa";

const app = new Koa();

app.use((req, res) => {
  res.writeHead(200);
  res.end("A request come in");
});

app.listen(3000, () => {
  console.log("Server listen on port 3000");
});
