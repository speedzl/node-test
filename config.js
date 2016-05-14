'use strict'

var path =require('path');
var util= require('./libs/util');
var wechat_file= path.join(__dirname, './config/wechat.txt');
var config = {
	wechat:{
		appId:'wxb8f95e4c56c4fa03',
		appSecret:'4a0ca5cf68583192d4c97f9c3fc6ac74',
        token:'albion',

        
        getAccessToken: function(){
            // console.log(JSON.stringify(this));
        	return util.readFileAsync(wechat_file);
        	
        },

        saveAccessToken: function(data){
        	
        	data =JSON.stringify(data);
        	// console.log(data);
        	return util.writeFileAsync(wechat_file,data);
        	
        }
    }
};
// console.log(config.wechat.getAccessToken());

module.exports = config;