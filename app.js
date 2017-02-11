//DEPRICATED

var http 		= require("http"),
	https 		= require("https"),
	request 	= require("request"),
	env       	= require("dotenv").config(),
	routerApp	= require("express")();

var TwitterStream = {
	init: function(){
		this.oauth = {
			consumer_key: process.env.CONSUMER_KEY,
			consumer_secret: process.env.CONSUMER_SECRET,
			token: process.env.API_TOKEN,
			token_secret: process.env.API_TOKEN_SECRET
		}
		this.url = {
			stream: process.env.TWITTER_USERSTREAM,
			post: process.env.TWITTER_UPDATE,
		}
		this.params = {
			stream: {
				track: process.env.TWITTER_HASHTAG,
				stringify_friend_ids: true,
				delimited: "length",
				stall_warnings: true
			},
			post: {
				status: ""
			},
			username: process.env.TWITTER_USERNAME
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
					console.log("Something going on with", length);
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
			.on("error", function(error){
				console.log("ERROR!");
				console.log(error);
			})
	},
	api : function(){
		var self = this;
		var server;

		routerApp.get("/alive", function(req, res){
			console.log("Keeping Alive");
			res.status(200).end();
		});

		server = routerApp.listen((process.env.PORT || 5000), function(){
			var host = server.address().address;
			var port = server.address().port;

			console.log("Running Server...");
			console.log("Host: " + host);
			console.log("Port: " + port);
			console.log("Visit: http://" + host + ":" + port);
		})
	},
	checkData: function(data){
		var index = data.search("\r\n");
		var self = this;

		data = data.substring(index);
		
		if(data.length > 100){
			try{
				data = JSON.parse(data);
				if(data.user && data.user.screen_name.toLowerCase() == self.params.username){
					self.post(data.text.replace(self.params.stream.track, ""))
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
TwitterStream.api();
TwitterStream.connect();