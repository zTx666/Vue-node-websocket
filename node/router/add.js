const Router = require('koa-router');
let router = new Router();
router.get('/add', async (ctx)=>{
  ctx.body = 'home'
})
module.exports = router.routes();