var express = require("express");
var app = express();
var router = express.Router();
var account = require("../models/account.js");



//미검증
//로그인
//return : userName, userRank
router.route("/login").post(function(req,res) {
	console.log("POSTED userId , userPW");

	if(account.canLogin(req.body.userId, req.body.userPW)) {
		var userInfo = account.getuserInfo(req.body.userId);
		//TODO 추후 수정 해야함?
		req.session.user = userInfo;
		req.session.user.authroized = true;
		
		res.json({
			userName: userInfo.userName,
			userRank: userInfo.userRank
		}); 
	} else
		res.status(400).json({
			error: "Wrong Id or Password",
			code: 0
		});
	

		

});



router.route("/logout").post(function(req, res) {
	
	if(!req.session.user)
		res.status(400).json({
			error: "Wrong Approach : Logout while not logined",
			code : -1
		});
	else {
		var userInfo = req.session.userInfo;
		req.session.destroy(function(err) {
			if(err) {
				console.log("[Error] logout didn't complete successfully");
				return;
			}
			console.log("userid "+userInfo.userId+"logout successfully");
			res.redirect("/auth");
		}); 	
	}
});

//미검증
//회원가입
router.route("/signup").post(function(req, res) {
	
	//ㅇㅖ시, 나중에 지우면 댐
	var userInfo_example = {
		userId: "string",
		userPW: "string",
		userName: "string",
		userTel: "string",
		userRank: "string",
		userUnit: "string"
	};
	


   // 아이디 유효성 검사
	if(validation.userIdValid(userInfo.userId)) {
		return res.status(400).json({
			error: "Bad userId",
			code: 1
		});
	}
	
	//비밀번호 유효성 검사
    if(validation.userPWValid(userInfo.userPW) {
    	return res.status(400).json({
			error: "Bad userPW",
			code: 2
		});
	}
    
	//사용자 이름 유효성 검사
    if(validation.userNameValid(userInfo.userName) {
    	return res.status(400).json({
			error: "Bad userName",
			code: 3
		});
	}

   	//사용자 ㄱㅖ급 유효성 검사
    if(validation.userRankValid(userInfo.userRank) {
    	return res.status(400).json({
			error: "Bad userRank",
			code: 4
		});
	}
       
   	//사용자 전화번호 유효성 검사
    if(validation.userTelValid(userInfo.userTel) {
    	return res.status(400).json({
			error: "Bad userTel",
			code: 5
		});
	}

	//사용자 소속 유효성 검사
    if(validation.userPWValid(userInfo.userPW) {
    	return res.status(400).json({
			error: "Bad userUnit",
			code: 6
		});
	}
    
     

	if(!account.isIdExists(req.body.userId))
		hasher({password:req.body.userPW}, function(err, pass, salt, hash) {
			var userInfo = {
				userId = req.body.userId,
				userPW = pass,
				userName = req.body.userName,
				userTel = req.body.userTel,
				userRank = req.body.userRank,
				userUnit = req.body.userUnit
			}
			account.signUp(userInfo);
			res.json({success:true}); 
		});
	else
		res.status(400).json({
			error: "Id already Exists",
			code: 10
		});
});


//미검증
//userInfo pw제외 send
router.route("/info").post(function(req,res) {
	var userInfo = account.getUserInfo(req.body.userId);
	if(!userInfo)
		res.status(400).json({success:false});
	
	userInfo.userPW = undefined;
	res.json(userInfo);	
});	

module.exports = router;



