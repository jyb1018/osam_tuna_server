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




http.createServer(app).listen(app.get('port'), function() {
	console.log("익스프레스 서버 시작 : "+app.get("port"));

});

router.route("/").get(function(req,res) {
	res.redirect("/main");
});


router.route("/main").get(function(req,res) {
	res.send({"msg" : "Hello World!", "status" : "500"});
});
	

router.route("/hello").get(function(req,res) {
	res.send("Hello!");
	
});

//get -> post로 change하면 됨.
router.route("/signup").get(function(req,res) {
	console.log("signup page");
	console.log(req.query);
	//exception 처리


	//중복검사 해야 되는 것
	//mil_num(군번)
	
	//중복 검사 완료

	//db에 등록
	
	res.send("successfully signup");

});

router.route("/login").post(function(req,res) {
	

	console.log("login page");

	//군번과 비밀번호 조회해서 맞는지.
	if(!canLogin(mil_num, password)) {
		//
		res.redirect("/");
	}
});

app.use("/", router);

app.all("*", function(req,res) {
	console.log("404 error");
	res.status(404).send("Wrong Approach");
});




