# Vue-node-websocket
Vue+elementUI+node+koa+websocket 实现单对单 单对多 聊天室

<h1>1.node后台使用koa框架生成两个服务<br> </h1>
<pre>
  koa-websocket 80端口  聊天服务 <br> 
  koa-static    8888端口 静态文件服务 <br> 
  测试前请在本地同时开启两个服务 <br> 
  cmd启动命令：<br> 
        npm run start
        或者
        node server.js
 /*使用process同时启动websocket服务
<h1>2.前端Vue+elementUI<br> </h1>
  本地项目：http://localhost:8888/html/chat.html<br> 
