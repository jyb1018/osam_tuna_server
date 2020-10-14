import express from "express";
import {userIdValid, userPWValid, userNameValid, userRankValid, userTelValid, userUnitValid} from "../utils/validation.js";
import bkfd2Password from 'pbkdf2-password';
import mysql from 'mysql2/promise';
import {getConnection, getUserInfo,getAllUserInfo, signUp, isIdExists, login, getSaltInfo} from '../db/account.js';

const hasher = bkfd2Password();
const router = express.Router();

async function checkIdAndGetPWSalt (req,res,next) {
	let {userId} = req.body;
	try{
		let salt = await getSaltInfo(userId);
		req.body.userPWSalt = salt.data;
		next();
	} catch(err){
		res.status(400).json({success:false,err:err, type:err.type}); 
	}
}

router.route("/login").post(checkIdAndGetPWSalt, async(req,res)=>{
	let {userId, userPW, userPWSalt} = req.body;
	hasher({password:userPW, salt:userPWSalt}, async function(err, pass, salt, hash) {
		let loginInfo =  {
			userId: userId,
			userPWSalt : salt,
			userPWHash : hash,
		};
		try{
			let userInfo = await login(loginInfo);
			req.session.isLogin = true;
			req.session.userInfo = userInfo;
			res.status(200).json({success:true, data:userInfo}); 
		} catch(err){
			res.status(400).json({success:false,err:err, type:err.type}); 
		}
	})
	
});




router.route("/logout").post( async (req, res)=> {
	if(!req.session.isLogin)
		res.status(400).json({
			type: "Wrong Approach : Logout while not logined",
			where:'/auth/logout - route',
			success: false,
		});
	else {
		let userInfo = req.session.userInfo;
		req.session.destroy(function(err) {
			if(err) {
				res.status(400).json({
					type: "Logout failed",
					where:'/auth/logout - route',
					success: false,
				});
			} else {
				res.status(200).json({
					success: true,
				});
			}
		}); 	
	}
});


async function validAll (req, res, next){
	let userInfo = {...req.body.userInfo};
	// 여기 코드 고치고 싶은데 ㅎㅎ; 어케할까
	if(!userIdValid(userInfo.userId)) {
		return res.status(400).json({
			type: "Bad userId",
			where:'validAll',
			success: false,
		});
	}
	else if(!userPWValid(userInfo.userPW)) {
		return res.status(400).json({
			type: "Bad userPW",
			where:'validAll',
			success: false,
		});
	}
	else if(!userNameValid(userInfo.userName)) {
		return res.status(400).json({
			type: "Bad userName",
			where:' validAll',
			success: false,
		});
	}
	else if(!userRankValid(userInfo.userRank)) {
		return res.status(400).json({
			type: "Bad userRank",
			where:'validAll',
			success: false,
		});
	}
	else if(!userTelValid(userInfo.userTel)) {
		return res.status(400).json({
			type: "Bad userTel",
			where:'validAll',
			success: false,
		});
	}
	else if(!userPWValid(userInfo.userPW)) {
		return res.status(400).json({
			type: "Bad userUnit",
			where:'validAll',
			success: false,
		});
	}
	else{
		next();
	}
}

async function isIdExist (req,res,next) {
	let userId = req.body.userInfo.userId;
	try{
		let isId = await isIdExists(userId);
		if(isId.data)
			return res.status(400).json({success:false,err:{}, type:"id already exists", where:'isIdExist'});
		else 
			next();
		 
	} catch(err){
		return res.status(400).json({success:false,err:err, type:err.type, where:'isIdExist'}); 
	}
}

router.route("/signup").post(validAll,isIdExist,(req, res)=> {
	let tempInfo = {...req.body.userInfo};
	hasher({password:tempInfo.userPW}, async function(err, pass, salt, hash) {
		
		delete tempInfo['userPW'];
		let userInfo =  {
			...tempInfo,
			userPWSalt : salt,
			userPWHash : hash,
			isWorker: tempInfo.isWorker ? 'TRUE' : 'FALSE',
		};
		
		try{
			await signUp(userInfo)
			res.status(200).json({success:true}); 
		} catch(err){
			res.status(400).json({success:false,err:err, type:err.type}); 
		}
		
		
	})
});

router.route("/info").post( async (req,res)=> {
	try{
		let userInfo = await getUserInfo(req.body.userId);
		res.status(200).json({success:true, data: userInfo}); 
	} catch(err){
		res.status(400).json({success:false,err:err, type:err.type}); 
	}
});	

router.route("/test").get( async (req,res) =>{
	try{
		let temp = await getAllUserInfo();
		res.status(200).json({success:true, data: temp}); 
	} catch(err){
		res.status(400).json({success:false,err:err, type:err.type}); 
	}
});


export default router;

