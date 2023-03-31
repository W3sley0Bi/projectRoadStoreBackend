const { db } = require('../../modules/DBConnection');
// const helper = require("../../../helper");
const config = require('../../../config');
const { hashSync, compareSync } = require('bcrypt')
const jwt = require('jsonwebtoken');

async function registration(req, res, next) {
	try {
		// await db.query(`SELECT * FROM user WHERE name = ${req.body.username}`,(err, result, fields)=>{
		// 	console.log(result)
		// 	if (result == undefined || result == null) return res.status(400).json({ message: `Username ${req.body.username} already taken` });
		// })
		 	db.query(`INSERT INTO user (name, password, role_fk) VALUES (
				'${req.body.username}',
				'${hashSync(req.body.password,10)}',
				'2')`, (err, result, fields) => {
			  if (err) throw err
			return res.status(201).json({ message: 'User registered' })});

	} catch (err) {
		res.status(400).json({ message: err.message });
		next(err);
	}

}

async function login(req, res, next) {
	try {
		db.query(`SELECT * FROM user WHERE name='${req.body.username}' `, (err, result, fields) =>{
  	if (err) throw err;
  	if(result.length == 0) return res.sendStatus(401)
  	//incorrect password
 	if(!compareSync(req.body.password, result[0].password)) return res.sendStatus(401)



//initializing the paylod for the jwt signature
  const payload = {
    Uid: result[0].idUser,
    Username: result[0].name,
    Role: result[0].role_fk,
  }

  payload.Email = result[0].email



  // this secret key must be equal to the key in the passport.js module
  const secretOrKey = `${process.env.SECRETJWT}`

  //creating a signature for the token and passing the payload, the secretkey and some options
  let token = jwt.sign(payload, secretOrKey, { expiresIn: "20d" })

  token = 'Bearer ' + token

  db.query(`UPDATE user SET access_token = '${token}' WHERE name='${req.body.username}'`, 
    (err, result, fields) => {
      
      if (err) throw err ;

      res.status(200).send({
        success: true,
        message: 'logged',
        token: token,
        userData: payload
      });
    
      
    });




})
		

	} catch (err) {
		res.status(400).json({ message: err.message });
		next(err);
	}
}


module.exports = {
	registration,
	login
};