var express = require("express");
var app = express();
var router = express.Router();
var Account = require("../models/account.js");




//로그인 체크 페이지
router.route("/login").post(function(req,res) {
	console.log("POSTED userId , userPW");

	if(canlogin(req.body.userId, req.body.userPW))
	{
		
	}
	else
	{
		res.send({"status" : "failed"});
	}

		

});

router.route("/login").get(function(req,res) {
		

});

router.route("/logout").post(function(req, res) {
	if(req.query.userId != "바ㄲㅝ야함.")
		;
	
});

router.route("/signup").post(function(req, res) {
	
	//정규표현식으로 사용한 아이디 유효성 검사
	let usernameRegex = /^[a-z0-9]+&/;
	
	if(!usernameRegex.test(req.body.userId)) {
		return res.status(400).json({
			error: "Bad username",
			code: 1
		});
	}
	
	//비밀번호 유효성 검사
	if(req.body.password.length < 4 || typeof req.body.password !== "string")
		return res.status(400).json({
			error: "Bad password",
			code: 2
		});
	}

	//TODO findOne 함수 구현 필요
	Account.findOne(userId, function(err, exists) {
		if(err) throw err;
		if(!exists)
			return res.status(401).json({
				error : "Username already exists",
				code : 3
			});
		
		hasher({password:req.body.pssword}, function(err, pass, salt, hash) {
			let account = new Account({
				userId: req.body.userId,
				userPW: hash,
				salt: sat
			});
			account.save( function(err) {
				if(err) throw err;
				return res.json({success:true});
			});
		});
		
	});
});

module.exports = router;



