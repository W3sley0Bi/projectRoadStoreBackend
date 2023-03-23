const db = require('../../modules/DBConnection');


async function registration(user){
    const result = await db.query(`INSERT INTO user (name, password)
         VALUES (
        '${user.username}',
        '${hashSync(user.password,10)}')`);

        if (result.affectedRows) {
            message = `submission added succesfully, data: ${helper.emptyOrRows(sub)}`;
          }
           //tokenSignature(result) ??
          return message;
}

async function login(){
   await db.query(`SELECT * FROM user WHERE name='${req.body.username}'`,)
}


    // making the login request
    app.post('/login', (req, res)=>{
        connection.query(`SELECT * FROM user WHERE name='${req.body.username}' `, 
        (err, result, fields) =>{
        
          if (err) throw err;
          //user not found
          if(result.length == 0){
            return res.sendStatus(401)
          }
          //incorrect password
         if(!compareSync(req.body.password, result[0].password)){
           return res.sendStatus(401)
        }
        
        
        //initializing the paylod for the jwt signature
          const payload = {
            Uid: result[0].idUser,
            Username: result[0].name,
            Role: result[0].role_fk,
          }
        
          // this secret key must be equal to the key in the passport.js module
          const secretOrKey = process.env.SECRETJWT
        
          //creating a signature for the token and passing the payload, the secretkey and some options
          const token = jwt.sign(payload, secretOrKey, { expiresIn: "20d" })
        
          let resToken = 'Bearer ' + token
        
          connection.query(`UPDATE user SET access_token = '${resToken}' WHERE name='${req.body.username}'`, 
            (err, result, fields) => {
              
              if (err) throw err ;
        
              res.status(200).send({
                success: true,
                message: 'logged',
                token: resToken
              });
            
              
            });
        
        
        
        
        })
        
        })

        module.exports = {
            registration,
          };