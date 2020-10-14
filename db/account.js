import mysql from 'mysql2/promise';
import sqlSetting from '../config/sqlSetting.js';

const pool = mysql.createPool(sqlSetting);

export const getConnection = async () => {
	try{
		const connection = await pool.getConnection(async conn => conn);
		return connection;
	} catch(err){
		throw({...err, type:"db not connect"});
	}
	
};

export const isIdExists = async (userId)=>{
	const connection = await getConnection();
	try{
		let query= `SELECT EXISTS (SELECT * FROM account WHERE userId='${userId}') AS success;`
		
		let [results] = await connection.query(query);
		if(results)
			return({success:true, data:true})
		else 
			return({success:true, data:false})
	} catch(err){
		throw {...err, type: "sql error"};
	} finally {
		connection.release();
	}
}

export const getSaltInfo = async (userId) => {
	const connection = await getConnection();
	try{
		let query= `SELECT userPWSalt FROM account WHERE userId='${userId}';`
		let [salts] = await connection.query(query);
		if(salts.length)
			return({success:true, data:salts[0]['userPWSalt']});
		else {
			throw {type:"no id", where:"getSaltInfo"};
		}
	} catch(err){
		throw {...err, type: err.type, where:"getSaltInfo"};
	} finally {
		connection.release();
	}
}

export const login = async ({userId, userPWHash, userPWSalt}) => {
	const connection = await getConnection();
	try{
		let query= `SELECT userId, userRank, userName, isWorker FROM account WHERE userId='${userId}'  AND  userPWHash='${userPWHash}' AND userPWSalt='${userPWSalt}';`
		let [results] = await connection.query(query);
		if(results.length)
			return({success:true, data:results});
		else {
			throw {type:"no id or wrong pw", where:"login"};
		}
	} catch(err){
		throw {...err, type: err.type, where:"login"};
	} finally {
		connection.release();
	}
}

export const signUp = async ({userId, userName, userTel, userUnit, userRank, userPWHash, userPWSalt, isWorker})=> {
	const connection = await getConnection();
	try{
		let tf = isWorker ? 'TRUE' : 'FALSE';
		let values = `values('${userId}','${userName}','${userTel}','${userUnit}','${userRank}','${userPWHash}','${userPWSalt}',${tf})`
		let query= `INSERT INTO account ${values};`
		
		let [results] = await connection.query(query);
		return {success:true,data:results}
	} catch(err){
		throw {...err, type: "alreay have same user"};
	} finally {
		connection.release();
	}
}


export const getUserInfo = async (id) => {
	const connection = await getConnection();
	try{
		let query= `SELECT userId,userName,userTel,userUnit,userRank FROM account WHERE userId='${id}';`
		let [results] = await connection.query(query);
		if(results.length)	
			return {success:true,data:results[0]}
		else 
			throw {type:"no id"};
	} catch(err){
		throw {...err, type:err.type};
	} finally {
		connection.release();
	}
}


export const getAllUserInfo = async ()=> {
	const connection = await getConnection();
	try{
		let query= `SELECT * FROM account;`
		let [results] = await connection.query(query);
		if(!results.length)	
			throw {type:"no user"};
		else 
			return {success:true,data:results}
	} catch(err){
		throw {...err, type: err.type};
	} finally {
		connection.release();
	}
}