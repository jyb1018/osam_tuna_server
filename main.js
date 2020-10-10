var http = require("http");
var url = require("url");
var express = require("express");
var app = express();
var router = express.Router();
app.set("port",process.env.PORT||"8080");
app.set("hostname", "127.0.0.1");

var mil_num;
var mil_class;
var name;
var callerid;
var password;


var auth = require("./routes/auth.js");


//npm install --save cookie-parser
const cookieParser = require("cookie-parser");

//npm install --save body-parser
const bodyParser = require("body-parser");

//npm install --save pbkfd2-password
const hasher = require("pbkfd2-password").bkfd2Password();

	


app.use(bodyParser.json());


http.createServer(app).listen(app.get('port'), function() {
	console.log("익스프레스 서버 시작 : "+app.get("port"));

});

router.route("/").get(function(req,res) {
	res.redirect("/main");
});


router.route("/main").get(function(req,res) {



app.use("/", router);
app.use("/auth", auth);


app.all("*", function(req,res) {
	console.log("404 error");
	res.status(404).send("Wrong Approach");
});




