'use strict'


var config = require('./config');
var Wechat = require('./wechat/wechat');
var path = require('path');

var wechatApi = new Wechat(config.wechat);

exports.reply = function*(next){
	var message = this.weixin;


	if(message.MsgType ==='event'){
		if(message.Event ==='subscribe'){
			if(message.EventKey){
				console.log('二维码'+ message.EventKey+''+message.ticket);
			}
			console.log(message);
			this.body= '订阅了\r\n'+'消息ID'+ message.msgType;
		}

	
	else if(message.Event ==='unsubscribe'){
		console.log('取消关注');
		this.body='';

	}
	else if(message.Event ==='LOCATION'){
		this.body = '位置'+message.Latitude+'/'+message.Longitude+'/'+message.Precision;
    }
    else if(message.Event ==='CLICK'){
    	this.body= "菜单"+message.EventKey

    }
    else if(message.Event ==='SCAN'){
    	console.log('关注扫描'+message.EventKey)
    }
    else if(message.Event ==='VIEW'){
    	this.body='点击了菜单中的链接'+message.EventKey
    }


	}
	else if (message.MsgType==='text'){
		var content = message.Content;
		var reply= '无法理解';

		if (content ==='1'){
			reply= '111111';
		}
		else if (content ==='2'){
			reply =[{
				title:'111',
				description:'3333',
				picurl:'http://y2.ifengimg.com/a/2016_17/5b7e8b85a81dde0_size32_w584_h375.jpg',
				url:'https://www.sublimetext.com/buy'

			}]

		}
		else if (content === "3"){
			var medianame= '2.jpg'
			var data = yield wechatApi.uploadMaterial('image',path.join(__dirname+'/'+medianame));
			reply = {
				type:'image', 
				mediaId: data.media_id
			}
		}

else if (content === "4"){
	        var medianame= '3.mp4'
			var data = yield wechatApi.uploadMaterial('video',path.join(__dirname+'/'+medianame));
			// console.log(data.media_id)
			reply = {
				type:'video',
				title:'1111',
				description:'2222',
				mediaId: data.media_id
			}
		}
		this.body= reply;
		this.medianame=medianame;
		// console.log(reply)
	}
	yield next

}