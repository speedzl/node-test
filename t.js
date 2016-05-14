exports._uploadMedia = function (filepath, type, callback) {
fs.stat(filepath, function (err, stat) {
if (err) {
return callback(err);
}
var form = formstream();
form.file(‘media’, filepath, path.basename(filepath), stat.size);
request(‘https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=’ + config.corpId + ‘&corpsecret=’ + config.corpsecret, function (err, response, body) {
if (!err && response.statusCode == 200) {
access_token = JSON.parse(body).access_token;
var url = ‘https://qyapi.weixin.qq.com/cgi-bin/media/upload?access_token=’ + access_token + ‘&type=’+ type;
var opts = {
url: url,
dataType: ‘json’,
method: ‘POST’,///
timeout: 60000, // 60秒超时
headers: form.headers(),
stream: form
var body = ”;
var req = request(opts, function(err, res, body) {
if (!err && res.statusCode == 200) {
console.log(‘HEADERS: ‘ + JSON.stringify(res.headers));
console.log(body); // {“errcode”:41005, “errmsg”:”media data missing”} 缺少多媒体文件数据
res.on(‘data’, function (chunk) {
console.log(‘BODY: ‘ + chunk);
});
}
});
}
});
});
}