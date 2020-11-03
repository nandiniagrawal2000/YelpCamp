
var express=require("express");
var app=express();
var bodyParser=require("body-parser");
var mongoose=require("mongoose");
var flash=require("connect-flash");
var Campground=require("./models/campground");
var seedDB=require("./seeds");
var passport=require("passport");
var methodOverride=require("method-override");
var LocalStrategy=require("passport-local");
var User=require("./models/user");

var Comment=require("./models/comment");

var commentRoutes=require("./routes/comments");
var campgroundRoutes=require("./routes/campgrounds");
var authRoutes=require("./routes/index");

//seedDB();

//mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true , useUnifiedTopology: true });
mongoose.connect("mongodb+srv://nandini:annieannie@cluster0.amtkg.mongodb.net/yelp_camp?retryWrites=true&w=majority", { useNewUrlParser: true , useUnifiedTopology: true });



app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
console.log(__dirname);
app.use(methodOverride("_method"));
app.use(flash());

//passport config
app.use(require("express-session")({
	secret:"Nandini Agrawal",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");
	next();
});


app.use(authRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);



app.listen(3000, function() { 
  console.log('Server listening on port 3000'); 
});
	
