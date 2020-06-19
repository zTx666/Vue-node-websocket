// websocket
const Koa = require("koa");
const WebSocket = require("koa-websocket");
const app = WebSocket(new Koa());
const logControl = require('./control/writeLog');
const readLog = require('./control/readLog');
const mail = require('./send_email');
let moment = require('moment');
let ctxs = [];
//let alluser  = require("./public/dist/users.json");
app.listen(80, () => {
    console.log(`Server running at http://localhost:80/`);
});
let alluser = [{
    uname: '默认用户',
    uid: 0,
    unread: 0
}];
const getUserIp = (req) => {
    return req.connection.remoteAddress || req.connection.socket.remoteAddress;
}
app.ws.use((ctx, next) => {
    /* 每打开一个连接就往  添加一个上下文 */
    var odate = moment().format('LTS'); //加入的时间戳
    logControl(`------------------------------------`,odate);
    ctxs.push(ctx);
    /* 返回用户列表 */
    ctx.websocket.send(JSON.stringify({
        alluser,
        type: 'getUser',
    }));
    /* 接收消息 */
    ctx.websocket.on("message", (message) => {
        var k_time = moment().format('LTS');
        var data = JSON.parse(message);
        logControl(`消息类型：${data.type}`, k_time);
        /* 信息类型是登录 第一次 */
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
                    type: 'getUser',
                }));
            });
            logControl(`新用户加入\tip为：${getUserIp(ctx.req)}\n当前用户人数：${ctxs.length}`, k_time);
            logControl(`昵称：${data.uname}\t ID：${data.uid}`, k_time);
        }
        /* 信息类型是聊天  */
        else if (data.type == "chat") {
            var need = {
                send_time: data.send_time,
                msg: data.send_msg,
                type: 'msg',
                uname: data.user.uname,
                uid: data.user.uid,
            };
            if (data.receiver.uid == 0) {
                mail(need.uname, '592969855@qq.com', need.msg);
                logControl(`留言成功！`, k_time);
            }
            ctxs.forEach((s) => {
                /* 发送者提示 */
                if (s.websocket.id == data.user.uid && s.websocket.readyState == 1) {
                    s.websocket.send(JSON.stringify({
                        msg: "发送成功！",
                        status: 1,
                        error: 0,
                        type: 'tip'
                    }), k_time);
                    logControl(JSON.stringify({
                        "类型": "发送消息",
                        "接受者": data.receiver.uname,
                        "ID": data.receiver.uid,
                        "内容": data.send_msg,
                        "结果": "发送成功"
                    }), k_time);
                }
                if (s.websocket.id == data.user.uid && s.websocket.readyState == 3) {
                    s.websocket.send(JSON.stringify({
                        msg: "发送失败！",
                        status: 0,
                        error: 1,
                        type: 'tip'
                    }));
                    logControl(JSON.stringify({
                        "类型": "发送消息",
                        "接受者": data.receiver.uname,
                        "ID": data.receiver.uid,
                        "内容": data.send_msg,
                        "结果": "发送失败"
                    }), k_time);
                }
                /* 接收者  */
                if (s.websocket.id == data.receiver.uid && s.websocket.readyState == 1) {
                    s.websocket.send(JSON.stringify(need));
                    logControl(JSON.stringify({
                        "类型": "接收消息",
                        "发送者": data.user.uname,
                        "ID": data.user.uid,
                        "内容": data.send_msg,
                        "结果": "接收成功"
                    }), k_time);
                }

                /* 更新所有好友列表 */
                s.websocket.send(JSON.stringify({
                    alluser,
                    type: 'getUser',
                }));
            })
        }
        setTimeout(() => {
            ctxs.forEach((s) => {
                s.websocket.send(JSON.stringify({
                    type: 'updateLog',
                    log: readLog(odate)
                }));
            })
        }, 1000)
    });
    ctx.websocket.on("close", (message) => {
        var a_time = moment().format('LTS');
        /* 连接关闭时, 清理 上下文数组, 防止报错 */
        let index = ctxs.indexOf(ctx);
        ctxs.splice(index, 1);
        for (let i = 0; i < alluser.length; i++) {
            if (alluser[i].uid == ctx.websocket.id) {
                let name = alluser[i].uname,
                    uid = alluser[i].uid;
                logControl(`用户退出\t昵称：${name}\t ID：${uid}\n当前用户人数：${ctxs.length}`, a_time);
                alluser.splice(i, 1);
            }
        }
        setTimeout(() => {
            ctxs.forEach((s) => {
                /* 更新所有好友列表 */
                s.websocket.send(JSON.stringify({
                    alluser,
                    type: 'getUser',
                }));
                s.websocket.send(JSON.stringify({
                    type: 'updateLog',
                    log: readLog(a_time)
                }));
            });
        }, 1000)
    });
});