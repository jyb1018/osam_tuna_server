const mysql = require("mysql");

var connection = mysql.createConnection({
	host : "localhost",
	user : "osam_tuna",
	password : "pass_osam_tuna",
	database : "osam_tuna"
});

//return : id or undefined;
function isIdExists(id) {
	var userId;
	connection.connect();
	connection.query("SELECT * from accounts where userId="+id, function(err, results, fields) {
	if(err)
		throw err;
	userId = results[0].userId;	
}); 
	connection.end(); 
	return userId;
}

//return : id or undefined;
function canLogin(id, hashed_pw) {
	if(!isIdExists(id)) 
		return undefined;
	
	connection.connect();
	connection.query("SELECT * FROM accounts WHERE userId="+id, function(err, results, fields) {
			if(err)
				throw err;
			connection.query("SELECT * FROM accounts WHERE userId="+id+" AND userPW="+hashed_pw+";",
			function(err, results, fields) {
				if(err)
					throw err;
				id = results[0].userId; 

			});
		});
	connection.end();
	return id;
	
};

//must use when logined
//return : userInfo
function getuserInfo(id) {
	var userInfo;
	connection.connect();
	connection.query("SELECT * from accounts where userId="+id+";", function(err, results, fields) {
		if(err)
			throw err;
		connection.query("SELECT * FROM accounts WHERE userId="+id+";", function(err, results, fields) {
			if(err)
				throw err;
			userInfo = results[0];
		});

		//userInfo가 undefined 될 경우는 오직 db오류임.
		if(!userInfo)
			throw err;

		return userInfo;
}

function signUp(userInfo) {
	const validation = require("../utils/validation.js");
	if(validation.userIdValid(userInfo.userId))
		return { wrongVal : "userId" }
	if(validation.userPWValid(userInfo.userPW))
		return { wrongVal : "userPW" }
	if(validation.userNameValid(userInfo.userName))
		return { wrongVal : "userName" }
	if(validation.userRankValid(userInfo.userRank))
		return { wrongVal : "userRank" }
	if(validation.userTelValid(userInfo.userTel))
		return { wrongVal : "userTel" }
	if(validation.userUnitValid(userInfo.userUnit))
		return { wrongVal : "userUnit" }

	var values = "values("+userInfo.userId+","+userInfo.userPW+","+userInfo.UserName+","+userInfo.userTel+","+userInfo.userTel+","+userInfo.userRank+","+userInfo.user+","+userInfo.userUnit+")";
	connection.connect();
	connection.query("INSERT INTO accounts "+values+";", function(err, results, fields)	{
		if(err)
			throw err;
		console.log("insert userInfo : "+values+" successfully");
		return true;
	});
	
}


module.export = {
	isIdExists = isIdExists;
	canLogin = canLogin;
	getuserInfo = getuserInfo;		
	signUp = signUp;
	
};

