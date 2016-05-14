
'use strict'

var sha1=require('sha1');
var getRawBody=require('raw-body')
var Wechat=require('./wechat');
var util=require('./util');
var Promise =require('bluebird');




module.exports =function(opts,handler){

   var wechat=new Wechat(opts);
   return function *(next){
	  // console.log(this.query);
	  var token = opts.token;
	  var signature = this.query.signature;
	  var nonce = this.query.nonce;
	  var timestamp = this.query.timestamp;
	  var echostr = this .query.echostr;
      // console.log(token);
	  var str = [token,timestamp,nonce].sort().join('');
	  var sha = sha1(str) ;

	  if(this.method==='GET'){
	  	 if (sha===signature){
		   this.body=echostr+'';
	      }
	       else{
		   this.body='wrong';
	      }
	    }
	  else if (this.method==='POST'){
	  	 if (sha!=signature){ 
	  		 	this.body='wrong';
		        return false;
	         }
	         
	         // console.log('-----------------------------------------------------this.req')
	         //  console.log(this.req)
	            var _data =yield getRawBody(this.req,{
		            length:this.length,
		         	limit:'1mb',
		         	encoding:this.charset,
		         	type:'text/plain'
			         } )
              // console.log('-----------------------------------------------------data')
              // console.log(_data)
	         // console.log(_data.toString())
	         var content= yield util.parseXMLAsync(_data);
	         var message = util.fomatMessage(content.xml);
	         // console.log ('格式化数据后---------------------------')
	         // console.log(content);
	         // console.log('fomate消息------------------------')
	         // console.log(message);
	         this.weixin  = message;
	         yield handler.call(this,next);
	          // console.log ('1---------------------------')
             // console.log(this)
	         wechat.reply.call(this);
	          // console.log ('2---------------------------')
	         // console.log('this')
	    }
	}
}

	   
    
