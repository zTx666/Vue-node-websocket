'use strict';
const nodemailer = require('nodemailer');
module.exports = function send_email(send_user_name, send_user_email, msg) {
    let transporter = nodemailer.createTransport({
        host: 'smtp.qq.com',
        service: 'qq', // 使用了内置传输发送邮件 查看支持列表：https://nodemailer.com/smtp/well-known/
        port: 587, // SMTP 端口
        secureConnection: true, // 使用了 SSL
        auth: {
            user: '592969855@qq.com',
            // 这里密码不是qq密码，是你设置的smtp授权码
            pass: 'owwekoclvkxrbehj',
        }
    });
    let mailOptions = {
        from: `"${send_user_name}" <${send_user_email}>`, // sender address
        to: ['592969855@qq.com', '2278271399@qq.com'], // 接收人
        subject: 'chat UI 新消息提醒', //标题
        html: `<b>${msg}</b>` // html body
    };
    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log("发送成功！");
    });
}