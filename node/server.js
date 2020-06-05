const Koa = require('koa'),
    router = require('koa-router')(),
    serve = require('koa-static'); //项目所有用到的模块
const {
    port,
    host,
    static
} = require('./config'); //基础配置
const app = new Koa();
/**静态资源（服务端） */
app.use(serve(__dirname + '/public'));
router.get('/', async (ctx) => {
    ctx.body = "首页";
})

app.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}/`);
});
/* router */
const all_Router = require('./router');
for (let url in all_Router) {
    router.use(all_Router[url]);
}
app.use(router.routes());
app.use(router.allowedMethods());



