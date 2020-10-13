import mysql from 'mysql';
import {userIdValid, userPWValid, userNameValid, userRankValid, userTelValid, userUnitValid} from "../utils/validation.js";
import sqlSetting from '../config/sqlSetting.js';
const connection = mysql.createConnection(sqlSetting);

//return : id or undefined;
export function isIdExists(id) {
	connection.query("SELECT * from account where userId="+id, function(err, results, fields) {
		if(err)
			throw err;
		return results.length === 0;
	}); 
}

//test function
export function getAll() {
	connection.query("SELECT * FROM account", function(err, results, fields) {
		if(err)
			throw err;
		return results;
	}); 
}

//return : id or undefined;
export function canLogin(id, hashed_pw) {
	if(!isIdExists(id)) 
		return undefined;
	connection.query("SELECT * FROM account WHERE userId="+id, function(err, results, fields) {
			if(err)
				throw err;
			connection.query("SELECT * FROM account WHERE userId="+id+" AND userPW="+hashed_pw+";",
			function(err, results, fields) {
				if(err)
					throw err;
				id = results[0].userId; 

			});
		});
	return id;
	
};

//must use when logined
//return : userInfo
export function getuserInfo(id) {
	var userInfo;
	connection.query("SELECT * FROM account WHERE userId="+id+";", function(err, results, fields) {
		if(err)
			throw err;
		userInfo = results[0];
	});

		//userInfo가 undefined 될 경우는 오직 db오류임.
	if(!userInfo)
		throw err;
	return userInfo;
}

export function signUp(userInfo) {
	console.log("여기오냐ㅐㄴㅁ")
	let tf = userInfo.isWorker ? 'TRUE':'FALSE';
	let values = `values(${userInfo.userId},${userInfo.userName},${userInfo.userTel},${userInfo.userUnit},${userInfo.userRank},${userInfo.userPWHash},${userInfo.userPWSalt},${tf})`
	connection.query("INSERT INTO account "+values+";", function(err, results, fields)	{
		if(err)
			throw err;
		console.log("insert userInfo : "+values+" successfully");
		return true;
	});
	
}




