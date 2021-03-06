var express = require("express");
var User = require("./models/user");
var passport = require("passport");

var router = express.Router();


//init user model and flash
router.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.errors = req.flash("error");
	res.locals.infos = req.flash("info");
	next();
});



//route for main page 
router.get("/", function(req, res, next) {
		res.render("index");
});


//route for users page
router.get("/users", function(req, res, next) {
	if(req.user && req.user.isAdmin){
		User.find()
		.sort({ createdAt: "descending" })
		.exec(function(err, users) {
			if (err) { return next(err); }
			res.render("users", { users: users });
		});
	}else{
		req.flash("error", "Restricted Area to Admins Only!");
		res.redirect("/");
	}
});



//route for GET signup 
router.get("/signup", function(req, res) {
	res.render("signup");
});

//route for POST signup
router.post("/signup", function(req, res, next) {
	var username = req.body.username;
	var password = req.body.password;

	User.findOne({ username: username }, function(err, user) {
		if (err) { return next(err); }
		if (user) {
			req.flash("error", "User already exists");
			return res.redirect("/signup");
		}
	
		var newUser = new User({
			username: username,
			password: password
		});
		newUser.save(next);
	});
	}, 
	passport.authenticate("login", {
		successRedirect: "/",
		failureRedirect: "/signup",
		failureFlash: true
	})
);


//GET login
router.get("/login", function(req, res) {
	res.render("login");
});


//POST login
router.post("/login", passport.authenticate("login", {
	successRedirect: "/",
	failureRedirect: "/login",
	failureFlash: true
}));


//GET logout
router.get("/logout", function(req, res) {
	req.logout();
	res.redirect("/");
});



//GET edit
router.get("/edit", ensureAuthenticated, function(req, res) {
	res.render("edit");
});



//POST edit (normally a PUT request but browsers supportonly get and post) 
router.post("/edit", ensureAuthenticated, function(req, res, next) {
	req.user.displayName = req.body.displayname;
	req.user.bio = req.body.bio;
	req.user.save(function(err) {
		if (err) { next(err); return;}
		req.flash("info", "Profile updated!");
		res.redirect("/edit");
	});
});






// GET user
router.get("/users/:username", function(req, res, next) {
	if(req.user && req.user.isAdmin){
		User.findOne({ username: req.params.username }, function(err, user) {
			if (err) { return next(err); }
			if (!user) { return next(404); }
			res.render("profile", { user: user });
		});
	}else{
		req.flash("error", "Restricted Area to Admins Only!");
		res.redirect("/");
	}
});


//DELETE user
router.get("/users/delete/:username", function(req, res, next) {
	if(req.user && req.user.isAdmin){
		User.findOne( { username: req.params.username }, function(err, user) {
			if (err) { return next(err); }
			if (!user) { return next(404); }
			user.remove( function ( err, movie ){
                res.redirect( '/users' );
            });
		});
	}else{
		req.flash("error", "Restricted Area to Admins Only!");
		res.redirect("/");
	}
});






// to make sure user is authenticated (used in the GET edit route)
function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		next();
	} else {
		req.flash("info", "You must be logged in to see this page.");
		res.redirect("/login");
	}
}





//exporting routes
module.exports = router;