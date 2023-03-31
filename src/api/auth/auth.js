const db = require('../../modules/DBConnection');
// const helper = require("../../../helper");
const config = require('../../../config');
const { hashSync, compareSync } = require('bcrypt')
const jwt = require('jsonwebtoken');

async function registration(req, res, next) {
	try {
		const results = await db.query(`SELECT * FROM user WHERE name = ?`, [req.body.username]);
		if (results.length >= 1) return res.status(400).json({ message: `Username ${req.body.username} already taken` });
		await db.query(`INSERT INTO user (name, password, email) VALUES ( ?, ?, ?)`, [req.body.username, hashSync(req.body.password, 10), req.body.email]);
		return res.status(201).json({ message: 'User registered' });
	} catch (err) {
		res.status(400).json({ message: err.message });
		next(err);
	}

}

async function login(req, res, next) {
	try {
		const results = await db.query(`SELECT * FROM user WHERE name = ? `, [req.body.username]);
		console.log(results)
		if (results.length == 0) return res.status(400).json({ message: `${req.body.username} not found ` });

		const userData = results[0];
		if (!compareSync(req.body.password, userData.password)) return res.status(400).json({ message: `${req.body.password} did not match ` });

		// initializing the paylod for the jwt signature
		const payload = {
			Uid: userData.idUser,
			Username: userData.name,
			Role: userData.role_fk,
		}

		//creating a signature for the token and passing the payload, the secretkey and some options
		let token = jwt.sign(payload, config.jwt, { expiresIn: "20d" })
		token = `Bearer ${token}`
		await db.query(`UPDATE user SET access_token = '${token}' WHERE name='${req.body.username}'`);

		payload.email = userData.email;

		res.status(200).json({
			success: true,
			message: 'logged',
			token: token,
			userData: payload
		});

	} catch (err) {
		res.status(400).json({ message: err.message });
		next(err);
	}
}

async function getPools(req,res,next){
	
}



module.exports = {
	registration,
	login
};