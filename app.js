var http 		= require("http"),
	https 		= require("https"),
	request 	= require("request"),
	config		= require("./config")

var TwitterStream = {
	init: function(){
		this.oauth = {
			consumer_key: config.oauth.consumer_key,
			consumer_secret: config.oauth.consumer_secret,
			token: config.oauth.token,
			token_secret: config.oauth.token_secret
		}
		this.url = {
			stream: config.endpoint.userstream,
			post: config.endpoint.update,
		}
		this.params = {
			stream: {
				track: config.hashtag,
				stringify_friend_ids: true,
				delimited: "length"
			},
			post: {
				status: ""
			}
		}
		this.tweets = [];
		console.log("INITIATED...")
	},
	connect: function(options){
		var self = this;
		var tweet = "";
		var length;
		var interval;

		request({url:self.url.stream, oauth:self.oauth, qs:self.params.stream, json:true, encoding: "utf8"})
			.on("data", function(chunk){
				if(length){

				}
				else{
					var newlineIndex = chunk.search("\r\n");
					length = Number(chunk.substring(0,newlineIndex));
				}
				tweet += chunk;
				length -= chunk.length;
				console.log("Streaming...");

				if(length <= 0){
					length = undefined;
					self.checkData(tweet);
					tweet = "";
				}
			})
	},
	checkData: function(data){
		var index = data.search("\r\n");
		var self = this;

		data = data.substring(index);
		
		if(data.length > 100){
			try{
				data = JSON.parse(data);
				if(data.user && data.user.screen_name.toLowerCase() == config.username){
					self.post(data.text.replace(config.hashtag, ""))
				}
			}
			catch(e){
				console.log(e);
				console.log(data);
			}
		}
	},
	post: function(tweet){
		var self = this;

		self.params.post.status = tweet;
		request({url:self.url.post, oauth:self.oauth, qs:self.params.post, json:true, encoding: "utf8", method: "POST"})
			.on("data", function(chunk){
				console.log(chunk);
			})
			.on("end", function(res){
				console.log("Posted");
			})
	}
}

TwitterStream.init();
TwitterStream.connect();