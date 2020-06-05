const Router = require('koa-router');
let router = new Router();
router.get('/del', async (ctx)=>{
  ctx.body = 'del222';
})
module.exports = router.routes();