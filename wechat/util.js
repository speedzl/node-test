'use strict'

var xml2js = require('xml2js');
var Promise = require('bluebird');
var tpl =require('./tpl');


exports.parseXMLAsync = function(xml){
	return new Promise(function(resolve,reject){
		xml2js.parseString(xml,{trim:true},function(err,content){
			if (err) reject(err);
			else resolve (content);
		})
	})
}


function fomatMessage(result){
	var message ={}
	if (typeof result ==='object'){
		var keys=Object.keys(result); 

		for(var i=0;i<keys.length;i++){
			var item= result[keys[i]];
			var key =keys[i];

			if(!(item instanceof Array)||item.length===0){
				continue;
			}
			if (item.length===1){
				var val =item[0];
				if (typeof val==='object'){
					message[key]=fomatMessage(val);
				}
				else {
					message[key] = (val ||'').trim();
				}
			}
			else {
				message[key] = [];
				for (var j=0,k=item.length;j<k;j++){
					message[key].push(fomatMessage(item[j]));
				}
			}
		}
	}
	return message;
}


exports.fomatMessage = fomatMessage;



exports.tpl = function(content, message){


	// console.log(content);
	// console.log(message);

	
	var info = {};
	var type ='text';
	var fromUsername = message.FromUserName;
	var toUsername = message.ToUserName;

	// console.log(fromUsername)

	if (Array.isArray(content)){
		type = 'news';
		// console.log(info);
	}
	

	

	type = content.type || type;


	info.content = content;
	info.createTime = new Date().getTime();
	info.msgType = type;
	info.toUserName = fromUsername;
	info.fromUserName = toUsername;

	// console.log(info);


	return tpl.compiled(info);

}
