var express     = require("express"),
    app         = express(),
	// port        = 3000,
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    flash       = require("connect-flash"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    seedDB      = require("./seeds")
    var fs = require('fs');
	var router       = express.Router();
	var xml2js       = require('xml2js');
	var parser       = new xml2js.Parser();	
	const dir = require('node-dir');
	const parseXML =  require('./parse-xml');
	
let directory = "raw";
let dirBuf =Buffer.from(directory);
fs.readdir(dirBuf,(err,files)=>{
	if(err){
		console.log(err.message);
	}
	else{
		console.log(files)
		files.forEach(function(rec){
			const options={
				match : /.xml$/
			}
			console.log('hi');
			dir.readFiles(rec,options,(err,content,next) =>{
				console.log('hi');
				if (err)
				{
					console.log(err.message);
				}
				const doc = parseXML(content);
				console.log(JSON.stringify(doc));
				next();
				
			})
		})
	}
})


//requiring routes
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index")
    
mongoose.connect('mongodb+srv://vikasraghav:vikasraghav1234@cluster0.qviyk.mongodb.net/webdev?retryWrites=true&w=majority',{
	useNewUrlParser: true,
	useUnifiedTopology: true
}).then(() => console.log('Connected to DB'))
.catch(error => console.log(error.message));

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
 seedDB(); 

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error= req.flash("error");
    res.locals.success = req.flash("success");
   next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Server Has Started!");
});