MPWechat.prototype.uploadMedia = function(medianame,reqData,callback){
    tools.log('uploadMedia start ...');
    var boundary = 'tvmin';
    var max = 9007199254740992;
    var dec = Math.random() * max;
    var hex = boundary + dec.toString(36);
    var mimes = {
        //image
        '.bmp': 'image/bmp',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
       // voice
        '.mp3': 'audio/mp3',
        '.wav': 'audio/x-wav',
        '.amr': 'audior',
        '.wma': 'audio/x-ms-wma',
        //video
        '.mp4': 'video/mp4',
        '.rm': 'video/rm',
        '.rmvb': 'videond.rn-realvideo',
        '.wmv': 'video/x-ms-wmv',
        '.avi': 'video/x-msvideo',
        '.mpg': 'video/mpeg',
        '.mpeg': 'video/mpeg'
    };
    var ext = path.extname(medianame).toLowerCase();
    var mime = mimes[ext];
    var boundaryKey = '----WebKitFormBoundary' + hex;
    var payload = '\r\n\r\n--' + boundaryKey + '\r\n'
        + 'Content-Disposition: form-data; name="uploadfile"; filename="'+ medianame +'"\r\n'
        + 'Content-Type: '+ mime +'\r\n\r\n';
    var enddata  = '\r\n--' + boundaryKey + '\r\n'
        + 'Content-Disposition: form-data; name="formId"\r\n\r\n'
        + '--' + boundaryKey + '--';
    var contentLength = Buffer.byteLength(payload,'utf8') + reqData.length  + Buffer.byteLength(enddata,'utf8');
    var options = {
        host: host,
        port: 443,
        method: 'POST',
        path: '/cgi-bin/uploadmaterial?cgi=uploadmaterial&type=0&token='+ this.token +'&t=iframe-uploadfile&lang=zh_CN&formId=null',
        headers: {
            'Content-Type': 'multipart/form-data; boundary='+boundaryKey,
            'Content-Length': contentLength,
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.31 (KHTML, like Gecko) Chrome/26.0.1410.43 Safari/537.31',
            'Cookie': this.cookie,
            'Referer': 'https://'+ host +'/cgi-bin/indexpage?token='+ this.token +'&lang=zh_CN&t=wxm-upload&lang=zh_CN&type=0&fromId=file_from_1341151893625'
        }
    };
    var req = https.request(options, function(response) {
        var statusCode = response.statusCode;
//        console.log('STATUS: ' + statusCode,options);
        response.setEncoding('utf8');
        var data = '';
        response.on('data', function(chunk) {
            data += chunk;
        }).on('end',function(){
                callback(data.match(/formId, '(\d+)'/)[1]);
            });
    });
    req.write(payload,'utf8');
    req.write(reqData,'binary');
    req.write(enddata,'utf8');
    req.end();

    req.on('error', function(e) {
        console.error("error:"+e);
    });
};