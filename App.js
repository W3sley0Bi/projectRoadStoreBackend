const app = require('./src/modules/Express')
const express = require('express')
const {query} = require('./src/modules/DBConnection')
const port = process.env.PORT || 3001

const mv = require('mv');
const fs = require('fs')
const path = require('path');

require('dotenv').config()

const upload = require('express-fileupload')
// const multer  = require('multer');
// var upload = multer({ dest: './files' });
const bodyParser = require('body-parser');

//cors is used for allowing to access to these apis
const cors = require("cors");
// used for the encryption and thecryption of the password for the users
const { hashSync, compareSync } = require('bcrypt')

// used for generating a unique id
const { v4: uuidv4 } = require('uuid');

// jwt is used for chckeing the sessione token
const jwt = require('jsonwebtoken')
// library that allow us to use the jwt easly
const passport = require('passport')
require('./src/modules/Passport')

//set the cors oringin for the working route 
app.use(cors()); 
// setupping the express  & passport stuff
app.use(express.json()); 
app.use(express.urlencoded({extended: false}));
app.use(passport.initialize())

// for statc element like files or static pages
//retrieving file from the client use this system
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(upload())



//adding users into the DB
// aggiiungre il token perché devi avere accesso admin
//rewrite the registration api, because only the admin can add new users
app.post('/registration',(req,res) =>{
query(`INSERT INTO user (name, password) VALUES (
    '${req.body.username}',
    '${hashSync(req.body.password,10)}')`, function(err, result, fields) {
  if (err) throw err;
res.send(result)
  //tokenSignature(result)
})

})

// making the login request
app.post('/login', (req, res)=>{
query(`SELECT * FROM user WHERE name='${req.body.username}' `, 
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
  const userData = {
    Uid: result[0].idUser,
    Username: result[0].name,
    Role: result[0].role_fk,
    Email: result[0].email
  }
  // data that i need for the user

  // this secret key must be equal to the key in the passport.js module
  const secretOrKey = process.env.SECRETJWT

  //creating a signature for the token and passing the payload, the secretkey and some options
  const token = jwt.sign(payload, secretOrKey, { expiresIn: "20d" })

  let resToken = 'Bearer ' + token

  query(`UPDATE user SET access_token = '${resToken}' WHERE name='${req.body.username}'`, 
    (err, result, fields) => {
      
      if (err) throw err ;

      res.status(200).send({
        success: true,
        message: 'logged',
        token: resToken,
        userData: userData
      });
    
      
    });




})

})

//the second arg is using the passport.js strategiy or the validation of the token
//before sending the output requested as result
app.get('/workers', passport.authenticate('jwt', { session: false }),(req,res)=>{
  //remember to change the query and not retrive everything but only the date that we want in the output
  query(`SELECT role_fk FROM user WHERE access_token = '${req.header("Authorization")}'`, 
  (err, result, fields) =>{
    if (err) throw err;

    if(result[0].role_fk == 1){
      
  try{
  query(`SELECT idUser, name, surname FROM user`, 
(err, result, fields) =>{
  if (err) throw err;
  res.json({
    result
  })
})
}catch(err){
  console.log(err)
}


}else{
  res.status(401).json("Access Denied")
}


})

})

//check if he has the rights to access this page
//the Capital letter is important
app.get('/:Uid/addFilesAccess', passport.authenticate('jwt', { session: false }),(req,res)=>{
  res.status(200).json({})
})


//add file to db and filsystem
//lower case latter at the beginning is important
app.post('/:Uid/addFiles',passport.authenticate('jwt', { session: false }),(req,res)=>{

  console.log(req.body)
  const folderName = `${req.body.folder}`
  const folderPath = `${__dirname}/public/files/${folderName}`

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath)
    }else{
      //rivedere bene 
    }

  //mving files into the folders

  // creating the folder
  const DBFolderPath = `./public/files/${folderName}`



  async function insertFolderAndFile() {
    try {
      const result = await new Promise((resolve, reject) => {
        query(`INSERT INTO folder (name, path, assigned_worker_id) VALUES (
          '${folderName}',
          '${DBFolderPath}',
          '${req.body.idUser}')`, 
          (err, result, fields) => {
            if (err) reject(err);
            resolve(result);
          });
      });

      const TableID = result.insertId;

      if(req.files){
        for (const file in req.files) {
          console.log(`${file} : ${req.files[file].name}`)
          let path=`./public/files/${folderName}/${req.files[file].name}`
          req.files[file].mv(path)
    
        query(`INSERT INTO file (name, path,	folder_fk) VALUES (
            '${req.files[file].name}',
            '${path}',
            '${TableID}')`, 
          (err, result, fields) =>{
            if (err) throw err;
            res.status(200).json({
              result
            })
          })
  
      }
    
      }

    } catch (error) {
      console.error(error);
    }

  }

  insertFolderAndFile();

  })


// getting the data of the single event
app.get(`/userFolder/:Uid`, passport.authenticate('jwt', { session: false }),(req,res)=>{
  //start from here
  query(`SELECT idFolder, name, assigned_worker_id FROM folder WHERE assigned_worker_id = '${req.params.Uid}' `, 
(err, result, fields) =>{
  if (err) throw err;
  res.json({
    result
  })
})

})


//per i file nella cartella specifica
app.get(`/userFolder/:Uid/:FolderContent`, passport.authenticate('jwt', { session: false }),(req,res)=>{
  //start from here
  query(`SELECT f.name as folder_name, f.path as folder_path, f.assigned_worker_id, 
  fi.idFile, fi.name as file_name, fi.path as file_path, fi.folder_fk
FROM folder f
LEFT JOIN file fi ON f.idFolder = fi.folder_fk
WHERE f.assigned_worker_id = '${req.params.Uid}' AND f.idFolder = '${req.params.FolderContent}'
`, 
 (err, result, fields) =>{
  if (err) throw err;

  //check sometimes this line gives you error

 res.json(result)

  });
});



app.get(`/getdocument/:idFile`, passport.authenticate('jwt', { session: false }),(req,res)=>{
 
const filePath = path.join(__dirname, `${req.query.filePath}`)
res.sendFile(filePath)

});


  













// //deleting the single event
// app.delete(`/singleEvent/:Eid`, passport.authenticate('jwt', { session: false }),(req,res)=>{
//   query(`DELETE FROM events WHERE Eid = '${req.params.Eid}' `, 
//   (err, result, fields) =>{
//     if (err) throw err;
//     res.json({
//       result
//   })
// })

// })


// //updating events into the events table
// app.put('/modifyEvent/:Eid',passport.authenticate('jwt', { session: false }),(req,res)=>{
//   console.log(req.params.Eid)
//   console.log(req.body)
//   query(` UPDATE events SET Date = '${req.body.date}', EventName = '${req.body.eventName}', EventAddress = '${req.body.eventAddress}', Lng = '${req.body.lng}', Lat = '${req.body.lat}' WHERE Eid = '${req.params.Eid}'`, function(err, result, fields) {
//   if (err) throw err;
//   res.send(result);
// })
// })


// //checking if the user has the token auth for visiting this page
// app.get('/addevent', passport.authenticate('jwt', { session: false }),(req,res)=>{
//   res.status(200)
// })

// //adding events into the events table
// app.post('/addevent',passport.authenticate('jwt', { session: false }),(req,res)=>{
//   console.log(req.body)
//   query(`INSERT INTO events (Date, EventName, EventAddress, Lng, Lat, PosterImg) VALUES (
//     '${req.body.date}',
//     '${req.body.eventName}',
//     '${req.body.eventAddress}',
//     '${req.body.lng}',
//     '${req.body.lat}',
//     '${req.body.placeholderImg}')`, function(err, result, fields) {
//   if (err) throw err;
//   res.send(result);
// })
// })



// add this token signature function in the registration
// not Working at the registration
// function tokenSignature(result){
//   const payload = {
//     Uid: result[0].Uid,
//     Username: result[0].Username,
//    //Password: result[0].Password,
//   }
//   const secretOrKey = 'secret_key' 
//   //creating a signature for the token
//   const token = jwt.sign(payload, secretOrKey, { expiresIn: "1d" })
//    res.status(200).send({
//     success: true,
//     message: 'logged',
//     token: 'Bearer ' + token
//   });
// }

app.listen(port,() =>{
  console.log(`listerin on ${port} `);
})

