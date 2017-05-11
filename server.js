var express = require("express");
var mongoose = require("mongoose");
var path = require("path");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var flash = require("connect-flash");
var routes = require("./routes");
var routes2 = require("./routes2");



var passport = require("passport");
var setUpPassport = require("./setuppassport");


var app = express();

mongoose.connect("mongodb://localhost:27017/test");
app.set("port", process.env.PORT || 3000);

setUpPassport();

app.use(express.static(__dirname + '/public'));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());// handling cookies


app.use(session({
	secret: "TKRv0IJs=HYqrvagQ#&!F!%V]Ww/4KiVs$s,<<MX",
	resave: true,
	saveUninitialized: true
}));


app.use(flash());// for showing errors

app.use(passport.initialize());//handling sessions and stuff
app.use(passport.session());


app.use(routes);
app.use(routes2);

app.listen(app.get("port"), function() {
	console.log("Magic happening on port " + app.get("port"));
});