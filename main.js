import http from"http";
import url from"url";
import express from"express";
import auth from"./routes/auth.js";
import expressSession from"express-session";
import cookieParser from"cookie-parser";
import bodyParser from"body-parser";
import bkfd2Password from 'pbkdf2-password';
 
const hasher = bkfd2Password();
const app = express();
const router = express.Router();
app.set("port",process.env.PORT||"8080");
app.set("hostname", "127.0.0.1");

var mil_num;
var mil_class;
var name;
var callerid;
var password;

app.use(expressSession({
	secret: "key",
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.json());
app.use("/", router);
app.use("/auth", auth);
app.all("*", function(req,res) {
	console.log("404 error");
	res.status(404).send("Wrong Approach");
});

http.createServer(app).listen(app.get('port'), function() {
	console.log("익스프레스 서버 시작 : "+app.get("port"));
});


