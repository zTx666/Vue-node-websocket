const Koa = require('koa'),
    router = require('koa-router')(),
    serve = require('koa-static'); //项目所有用到的模块
let fs = require('fs');
const {
    port,
    host,
    static
} = require('./config'); //基础配置
const app = new Koa();
/**静态资源（服务端） */
app.use(serve(__dirname + '/public'));
router.get('/', async (ctx) => {
    ctx.response.redirect('/html/')
})
router.get('/getOption', (ctx) => {
    let data = fs.readFileSync('./data/task.json', function (err, data) {
        if (err) {
            return console.log(err);
        }
        return data.toString();
    })
    ctx.response.body = data;
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