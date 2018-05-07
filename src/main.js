import koa from "koa";
const app = new koa();

app.use(async ctx=>{
    ctx.body = "Hello Word !"
})
app.listen(3000);
console.log("koa is listening port 3000!")