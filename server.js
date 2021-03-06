var express = require('express');
var app = express();
app.listen(process.env.PORT||8080,function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
var routes = require('./app/routes/index.js');
var mongoose = require('mongoose');
var passport = require('passport');
var session= require('express-session');

require('dotenv').load();
require('./app/config/passport')(passport);
mongoose.connect(process.env.MONGO_URI);
mongoose.Promise=global.Promise;
app.use('/controllers',express.static(process.cwd()+'/app/controllers'));
app.use('/public',express.static(process.cwd()+'/public'));
app.use('/common', express.static(process.cwd() + '/app/common'));
app.use(session({
   secret:'vote',
   resave:false,
   saveUninitialized:true

}));
app.use(passport.initialize());
app.use(passport.session());

routes(app,passport);
