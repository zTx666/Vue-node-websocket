let fs = require('fs');
let moment = require('moment');
let {
    log_path
} = require('../config');
moment.locale('zh-cn');
module.exports = function writeLog(data) {
    let odate = moment().format('YYYY-MM-D');
    let filename = `${log_path}/${odate}.txt`;
    fs.stat(filename, function (err, stats) {
        if (err) {
            if (err.code == 'ENOENT') {
                // 没找到文件的时候 先创建文件
                writeFile(filename, data);
            }
        } else if (stats.isFile()) {
            // 有这个文件 继续添加
            appendFile(filename, data);
        }
    })
}
 function writeFile(path, data) {
     fs.writeFile(path, data, function (err) {
        if (err) {
            return console.log(err);
        }
        //console.log('创建新文件' + path);
    });
}
async function appendFile(path, data) {
    let appendTime = moment().format('LTS');
    data = `\n${appendTime}\t${data}`;
    await fs.appendFile(path, data, function (err) {
        if (err) {
            return console.log(err);
        }
        //console.log('文件续写' + path + '内容:\n' + data);
    });
}