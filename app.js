var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    flash           = require('connect-flash'),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    Course          = require("./models/course"),
    Topic           = require("./models/topic"),
    Resource        = require("./models/resource"),
    
    //Added for forum
    Question        = require("./models/question"),
    Reply           = require("./models/reply"),
    
    User            = require("./models/user"),
    seedDB          = require("./seeds"),
    methodOverride  = require('method-override');
    
//requiring routes
var topicRoutes     = require("./routes/topics"),
    courseRoutes    = require("./routes/courses"),
    indexRoutes     = require("./routes/index"),
    resourceRoutes  = require("./routes/resources"),
    
    //Added for forum
    questionRoutes  = require("./routes/questions"),
    replyRoutes     = require("./routes/replies");

//var url = process.env.DATABASEURL || 'mongodb://localhost/yelp_camp_v10';
//mongoose.connect(url);

//mongoose.connect('mongodb://localhost/yelp_camp_v10');
mongoose.connect('mongodb+srv://CS345:de3s2VTZ5dpXY_K@cluster0-eeqru.mongodb.net/test?retryWrites=true',{ useNewUrlParser: true });

//var url = process.env.DATABASEURL || 'mongodb+srv://c:de3s2VTZ5dpXY_K@cluster0-rwskd.mongodb.net/test?retryWrites=true';
//mongoose.connect(url);



app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));
app.use(flash());
// seedDB(); //seed the database

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
   res.locals.error = req.flash('error');
   res.locals.success = req.flash('success');
   next();
});


app.use("/", indexRoutes);
app.use("/courses", courseRoutes);
app.use("/courses/:id/topics", topicRoutes);
//app.use("/courses/:id/topics/:idx/resources", resourceRoutes);
app.use("/topics/:id/resources", resourceRoutes);


//Added for forum
app.use("/questions", questionRoutes);
app.use("/questions/:id/replies", replyRoutes);

//Added for the Compiler
app.post('/compiler', function(req, res){
    
    //require request package to make HTTPs call to jdoodle, which is the API I use to compile the code
    var request = require('request');
    
    //this include source code to be compiled and language of the code. Also other info like API key and ID
    var program = {
        script : req.body.sourceCode,
        language: req.body.language,
        versionIndex: "0",
        clientId: "9af9eaa3d2ff7be1240f83af576923c",
        clientSecret:"c6b9d6bdfedf151896a23a9701aa3bd062a5093f4e24f3db323dd1c36a0430c6"
    };
    
    //This is the request call to API URL
    request({
        url: 'https://api.jdoodle.com/execute',
        method: "POST",
        json: program
    },
    //Access the output by body.output
    function (error, response, body) {
        console.log('error:', error);
        console.log('statusCode:', response && response.statusCode);
        console.log('body:', body.output);
        
        //passed source code to display in the same page with output
        req.session.sourceCode = req.body.sourceCode;
        
        
        //This part is to redirect the Compiler Show page with data. The data being the body.output
        var string = encodeURIComponent(body.output); //encode output as string, which then becomes one part of the URL
        res.redirect('/compiler?valid=' + string); //redirect to /compiler with body.output
    });
    
});
//Show page of the compiler
app.get('/compiler', function(req,res){
    
    //passed source code to display in the same page with output
    var input = req.session.sourceCode;
    req.session.sourceCode = null; //clear session for new session in the future
    
    var passedVariable = req.query.valid;  //Get the data passed to /compiler, which is body.output from app.post()
    res.render('pluginIndex', {output: passedVariable, input:input});

    
});



app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Final project Has Started!");
});