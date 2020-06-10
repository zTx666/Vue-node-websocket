// websocket
let Koa = require("koa");
let WebSocket = require("koa-websocket");
let app = WebSocket(new Koa());
let ctxs = [];
// let alluser  = require("./public/dist/users.json");
app.listen(80, () => {
    console.log(`Server running at http://localhost:80/`);
});
let alluser = [{
    uname: '默认用户',
    uid: 0,
    unread:0
}];
app.ws.use((ctx, next) => {
    /* 每打开一个连接就往  添加一个上下文 */
    ctxs.push(ctx);
    ctx.websocket.send(JSON.stringify({
        alluser,
        type: 'getUser'
    }));
    ctx.websocket.on("message", (message) => {
        var data = JSON.parse(message);
        // data.type = "msg";
        if (data.type == "login") {
            ctx.websocket.id = data.uid;
            alluser.push({
                "uid": data.uid,
                "uname": data.uname,
            });
            ctxs.forEach((s) => {
                /* 更新所有好友列表 */
                s.websocket.send(JSON.stringify({
                    alluser,
                    type: 'getUser'
                }));
            });
            console.log("用户" + data.uid + "加入聊天室");
        } else if (data.type == "chat") {
            var need = {
                send_time: data.send_time,
                msg: data.send_msg,
                type: 'msg',
                uname: data.user.uname,
                uid: data.user.uid,
            };
            ctxs.forEach((s) => {
                /* 更新所有好友列表 */
                s.websocket.send(JSON.stringify({
                    alluser,
                    type: 'getUser'
                }));
                /* 接收者  */
                if (s.websocket.id == data.receiver.uid && s.websocket.readyState == 1) {
                    s.websocket.send(JSON.stringify(need));
                }
                /* 发送者提示 */
                if (s.websocket.id == data.user.uid && s.websocket.readyState == 1) {
                    s.websocket.send(JSON.stringify({
                        msg: "发送成功！",
                        status: 1,
                        error: 0,
                        type: 'tip'
                    }));
                }
                if (s.websocket.id == data.user.uid && s.websocket.readyState == 3) {
                    s.websocket.send(JSON.stringify({
                        msg: "发送失败！",
                        status: 0,
                        error: 1,
                        type: 'tip'
                    }));
                }
            })
        }
    });
    ctx.websocket.on("close", (message) => {
        /* 连接关闭时, 清理 上下文数组, 防止报错 */
        let index = ctxs.indexOf(ctx);
        console.log(ctxs[index].websocket.id + "关闭了链接");
        for (let i = 0; i < alluser.length; i++) {
            if (alluser[i].uid == ctx.websocket.id) {
                alluser.splice(i, 1);
            }
        }
        ctxs.splice(index, 1);
        ctxs.forEach((s) => {
            /* 更新所有好友列表 */
            s.websocket.send(JSON.stringify({
                alluser,
                type: 'getUser'
            }));
        });
    });
});