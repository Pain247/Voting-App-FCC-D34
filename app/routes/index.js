'use strict';
var path = process.cwd();
var idP =0;
var arr1=[];
var max=0;
var ind=0;
var bparser = require('body-parser');
var urlencoded = bparser.urlencoded({extended :false});
var mongo = require("mongodb").MongoClient;
module.exports = function (app, passport) {

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/login');
		}
	}


app.route('/').get(function(req,res){
		if(isLoggedIn) res.redirect('/poll');
		else res.redirect('/login');
});
//đăng nhập
	app.route('/login')
		.get(function (req, res) {
			res.sendFile(path + '/public/login.html');
		});
//đăng xuất
	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/login');
		});
// route đến trang cá nhân
app.route('/profile/:id')
		.get(isLoggedIn, function (req, res) {
			res.sendFile(path + '/public/profile.html');
		});
//route đến trang vote
 app.route('/vote').get(isLoggedIn,function(req,res){
 res.redirect('/poll');
 });

//route đến mục tạo poll
app.route('/create').get(isLoggedIn,function(req,res){
	res.sendFile(path+'/public/create.html');
});
// Tạo một poll mới và đưa vào csdl
app.post('/create/api',isLoggedIn,urlencoded,function(req,res){
mongo.connect(process.env.MONGO_URI,function(err,db){
 var collection=db.collection('polls');
 var newPoll = function(db,callbacks){
	 var options =[];
	 for(var i=0;i<req.body["op"].length;i++){
		options.push([req.body["op"][i],0]);
	 }
   var polls = {
       polls:{
       pollId : ++ind,
			 userId : req.user.github.id,
			 title: req.body.title,
			 choice: options
		 }
   };
   collection.insert([polls]);
   res.redirect('/poll');
	 console.log(ind);
 };
 newPoll(db,function(){
   db.close();
 });
});
});

//api trả về all poll
app.get('/allpoll',isLoggedIn,function(req,res){
mongo.connect(process.env.MONGO_URI,function(err,db){
 var collection1 = db.collection('polls');
 var getAllPoll = function(db,callback){
   collection1.find().toArray(function(err,doc){
     if(err) throw err;
  // Tìm poll có pollId lớn nhất để, khi tạo poll mới id sẽ tăng theo giá trị này
		 for(var k=0;k<doc.length;k++){
			 arr1.push(doc[k].polls.pollId);
		 }
		 for(var h=0;h<arr1.length;h++){
			 if(arr1[h]>max) max = arr1[h];
		 }
				 ind=  max;
     res.send(doc);

 });

 };
 getAllPoll(db,function(){
	 db.close();
 });

});

});
//

// route đến /poll
app.route('/poll').get(isLoggedIn,function(req,res){
	res.sendFile(path+'/public/poll.html');
});
// trả về api của từng poll
app.get('/poll/api/:pollId',function(req,res){
   var id= parseInt(req.params.pollId);
 mongo.connect(process.env.MONGO_URI,function(err,db){
   var collection2 = db.collection('polls');
	 var getPoll = function(db, callback){
    collection2.find({'polls.pollId': id}).toArray(function(err,doc){
     res.send(doc);
		});

	 };
	 getPoll(db,function(){
		 db.close();
	 });

 });

});
// Trả về trang vote của từng pollId
app.get('/poll/:pollId',isLoggedIn,function(req,res){
	idP = parseInt(req.params.pollId);
  res.sendFile(path+'/public/vote.html');
});
// Trả về poll của từng người dùng
app.get('/polls/:id',isLoggedIn,function(req,res){
 var userPoll = req.params.id;
 mongo.connect(process.env.MONGO_URI,function(err,db){
   var collection4 = db.collection('polls');
	 var getUserPoll = function(db,callback){
		 collection4.find({'polls.userId':userPoll}).toArray(function(err,doc){
			 if(err) throw err;
			 res.send(doc);
		 });
	 };
	 getUserPoll(db,function(){
		 db.close();
	 });

 });


});
//Xóa poll
app.get('/polls/delete/:pollId',isLoggedIn,function(req,res){
  var del= parseInt(req.params.pollId);
	mongo.connect(process.env.MONGO_URI,function(err,db){
    var collection5 = db.collection("polls");
		var delPoll= function(db,callback){
			collection5.remove({'polls.pollId':del});
		};
		delPoll(db,function(){
			db.close();
		});

	});
res.redirect('/profile/'+req.user.github.id);

});

//Xử lý sự kiện radio và cập nhật csdl
app.post('/choice',isLoggedIn,urlencoded,function(req,res){
 var choice = req.body.options;
	mongo.connect(process.env.MONGO_URI,function(err,db){
		var collection3 = db.collection('polls');
		var update= function(db, callback){
		collection3.find({'polls.pollId': idP}).toArray(function(err,doc){
    var arr = doc[0];

	 if(err) throw err;
      var options = arr.polls.choice;
			for(var i=0;i<options.length;i++){
        if(Number(choice)===i){
           options[i][1]++;
				}
			}
		doc[0].polls.choice =[];
     options.forEach(function(option){
			 doc[0].polls.choice.push(option);
		 });
		  collection3.remove({'polls.pollId': idP });
	    collection3.insert([doc[0]]);
			console.log(doc[0].polls.choice[0][1]);

		});
	};
	update(db, function(){
		db.close();

	});
	});
  	res.redirect('/poll/'+idP);
});
// chứa json về tài khoản github
app.route('/api/:id')
		.get(isLoggedIn, function (req, res) {
			res.json(req.user.github);
		});
//Xác thực tài khoản github
app.route('/auth/github')
		.get(passport.authenticate('github'));

	app.route('/auth/github/callback')
		.get(passport.authenticate('github', {
			successRedirect: '/',
			failureRedirect: '/login'
		}));


};
