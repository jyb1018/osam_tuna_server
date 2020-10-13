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

//로그인
var auth = require("./routes/auth.js");

//세션
var expressSession = require("express-session");
app.use(expressSession({
	secret: "key",
	resave: true,
	saveUninitialized: true
});


//npm install --save cookie-parser
const cookieParser = require("cookie-parser");

//npm install --save body-parser
const bodyParser = require("body-parser");
app.use(bodyParser.json());

//npm install --save pbkfd2-password
const hasher = require("pbkfd2-password").bkfd2Password();





http.createServer(app).listen(app.get('port'), function() {
	console.log("익스프레스 서버 시작 : "+app.get("port"));

});





app.use("/", router);
app.use("/auth", auth);


app.all("*", function(req,res) {
	//TODO 페이지렌더링 작성할것
	console.log("404 error");
	res.status(404).send("Wrong Approach");
});




