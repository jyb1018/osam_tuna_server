import express from "express";
import {canLogin, getuserInfo, isIdExists, signUp, getAll} from "../models/account.js";
import {userIdValid, userPWValid, userNameValid, userRankValid, userTelValid, userUnitValid} from "../utils/validation.js";
import bkfd2Password from 'pbkdf2-password';
import sqlSetting from '../config/sqlSetting.js';
import mysql from 'mysql';
const connection = mysql.createConnection(sqlSetting);
connection.connect(function(err) {
	if(err) console.error('mysql connection error : ' + err);
	else console.log('mysql is connected successfully!');
});
const hasher = bkfd2Password();

var app = express();
var router = express.Router();



//미검증
//로그인
//return : userName, userRank
router.route("/login").post(function(req,res) {
	console.log("POSTED userId , userPW");

	if(canLogin(req.body.userId, req.body.userPW)) {
		var userInfo = getuserInfo(req.body.userId);
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

router.route("/test").get( async (req,res) =>{
	let temp = await isIdExists('12-211');
	console.log(temp)
	res.status(200).json({
		data: temp
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


function validAll (req, res, next){
	let userInfo = {...req.body.userInfo};
	if(!userIdValid(userInfo.userId)) {
		return res.status(400).json({
			type: "Bad userId",
			code: 1
		});
	}
	else if(!userPWValid(userInfo.userPW)) {
		return res.status(400).json({
			type: "Bad userPW",
			code: 2
		});
	}
	else if(!userNameValid(userInfo.userName)) {
		return res.status(400).json({
			type: "Bad userName",
			code: 3
		});
	}
	else if(!userRankValid(userInfo.userRank)) {
		return res.status(400).json({
			type: "Bad userRank",
			code: 4
		});
	}
	else if(!userTelValid(userInfo.userTel)) {
		return res.status(400).json({
			type: "Bad userTel",
			code: 5
		});
	}
	else if(!userPWValid(userInfo.userPW)) {
		return res.status(400).json({
			type: "Bad userUnit",
			code: 6
		});
	}
	connection.query("SELECT * from account where userId="+userInfo.userId, function(err, results, fields) {
		if(err)
			res.status(400).json({
				type: "err",
				code: 10
			});
		if(results.length === 0) next();
		else {
			res.status(400).json({
				type: "Id Already Exist",
				code: 10
			});
		}
	}); 
}

router.route("/signup").post(validAll,(req, res)=> {
	let tempInfo = {...req.body.userInfo};
	hasher({password:tempInfo.userPW}, async function(err, pass, salt, hash) {
		delete tempInfo['userPW'];
		let userInfo =  {
			...tempInfo,
			userPWSalt : salt,
			userPWHash : hash,
		};
		let tf = userInfo.isWorker ? 'TRUE':'FALSE';
		let values = `values('${userInfo.userId}','${userInfo.userName}','${userInfo.userTel}','${userInfo.userUnit}','${userInfo.userRank}','${userInfo.userPWHash}','${userInfo.userPWSalt}',${tf})`
		connection.query("INSERT INTO account "+values+";", function(err, results, fields)	{
			if(err)
				res.json({success:false, error: err, type: "sql error", code: 11});
			else {
				res.json({success:true});
			}
			
		})
	})
});


//미검증
//userInfo pw제외 send
router.route("/info").post(function(req,res) {
	var userInfo = getUserInfo(req.body.userId);
	if(!userInfo)
		res.status(400).json({success:false});
	
	userInfo.userPW = undefined;
	res.json(userInfo);	
});	

export default router;

