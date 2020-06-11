let fs = require('fs');
let moment = require('moment');
let {
    log_path
} = require('../config');
moment.locale('zh-cn');
module.exports = function readLog() {
    return readfilelog(log_path);
}
function readfilelog(log_path) {
    let odate = moment().format('YYYY-MM-D');
    let filename = `${log_path}/${odate}.txt`;
    return  fs.readFileSync(filename, function (err, data) {
        if (err) {
            return console.log(err);
        }
        return data.toString();
    })
}