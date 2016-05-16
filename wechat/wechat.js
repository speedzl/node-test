'use strict'

var Promise =require('bluebird');
var request = Promise.promisify(require('request'));
var util=require('./util');
var fs = require('fs');
var prefix='https://api.weixin.qq.com/cgi-bin/';

var api = {
 	accessToken:prefix + 'token?grant_type=client_credential',
 	upload: prefix + 'media/upload?'
 }



function Wechat(opts){
	var that = this;
	this.appId = opts.appId;
	this.appSecret = opts.appSecret;
	this.getAccessToken = opts.getAccessToken;
	this.saveAccessToken = opts.saveAccessToken;
	this.fetchAccessToken();
	// console.log(opts);
	// console.log(this); 
	// console.log(that);
	 // console.log(JSON.parse(this.getAccessToken));
	// console.log('W'+opts.getAccessToken());
     // console.log(JSON.stringify(this))
	
}


Wechat.prototype.fetchAccessToken =function(data){

	var that = this ;
	// console.log(this.access_token);

	if (this.access_token && this.expires_in){

		if(this.isValidAccessToken(this)){
			return Promise.resolve(this);
		}
	}

	 return this.getAccessToken()
	  .then(function(data){
	  	try{
	  		data =JSON.stringify(data);   
	  		 // console.log(JSON.stringify(data));
			}
	  	catch(e){
	  		return that.updateAccessToken();
	  		// console.log('update'+data);
	  	}
	  	if(that.isValidAccessToken(data)){
	  		return Promise.resolve(data);
	  		// console.log('is'+data);

	  	}
	  	else{
	  		return that.updateAccessToken(data);
	  		// console.log('update1'+data);
	  	}
	  })
	  .then(function(data){
	  	// console.log(data);
	  	that.access_token=data.access_token;
	  	
	  	that.expires_in =data.expires_in;

	  		// console.log('111'+data);

	      that.saveAccessToken(data);
	      return Promise.resolve(data);
	       // console.log(data);
	  })

}

Wechat.prototype.isValidAccessToken =function(data){
	if(!data||!data.access_token||!data.expires_in){
		return false;
	}
	var access_token=data.access_token;
	var expires_in=data.expires_in;
	var now=(new Date().getTime());


	if(now < expires_in){
		return true;
	}
	else{
		return false;
	}
}

Wechat.prototype.updateAccessToken = function(){
	var appId= this.appId;
	var appSecret= this.appSecret;
	var url = api.accessToken + '&appid=' + appId + '&secret=' + appSecret;

    // console.log(url);
  return new Promise(
  	function(resolve,reject){


  	  request({url:url,json:true}).then(function(response){
  	  	


      	   var data= response.body;
      	  

      	   var now = (new Date().getTime());

      	   // console.log(data+'|'+now);

           var expires_in = now + (data.expires_in - 20)*1000;


      	    data.expires_in = expires_in;


      	    resolve(data);

        // console.log(data);
        })
  
    })
}



Wechat.prototype.uploadMaterial = function*(type, filepath){
	var that = this;
  return new Promise(
  	function(resolve,reject){

  		that.fetchAccessToken().then(function(data){
  			
  		    var url = api.upload + 'access_token=' + data.access_token + '&type='+type;
  		 		
              	request({  
                         method: 'POST',
              	         url: url,
              	         json: true,
                  
       					 formData: {
         							media: fs.createReadStream(filepath),
         							nonce: ''
        							} 
        	    }).then(function(response){
             			
         				   var _data = response.body;

				           if(response.statusCode === 200){
				           		resolve(_data);
				           		console.log(_data);
				           }
				           else{
				           		throw new Error('Upload错误')
         				   }

             			  
       				})	
          	})

	  	      .catch(function(err){
	           		reject(err); 
			   		console.log(err) ;
           	})

      	
        
    })
    
    
}

Wechat.prototype.reply = function(){
	var content = this.body;
	var message = this.weixin;
    // console.log('content-----------------------');
	// console.log(content);
	// console.log('message-------------------');
	// console.log(message)
	var xml = util.tpl(content,message);


	this.status = 200;
	this.type = 'application/xml';
	this.body = xml;

}


module.exports=Wechat;