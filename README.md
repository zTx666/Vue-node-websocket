# Vue-node-websocket
Vue+elementUI+node+koa+websocket 实现单对单 单对多 聊天室

1.node后台使用koa框架生成两个服务 
  koa-websocket 80端口  聊天服务 
  koa-static    8888端口 静态文件服务 
  测试前请在本地同时开启两个服务 
  cmd命令：
        nodemon .\server.js 
        nodemon .\websocket.js
2.前端Vue+elementUI
  地址：http://localhost:8888/html/chat.html
