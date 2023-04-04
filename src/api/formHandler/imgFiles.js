// const { db } = require('../../modules/DBConnection')
// const nodemailer = require('nodemailer');
// const config = require("../../../config");

// const imgFiles = async (req,res,next,files) => {



//         if (req.files) {
//             for (const file in req.files) {  
//             //  db.query("INSERT INTO image (name, bufferData, type,folder_fk) VALUES (?,?,?,?)",
//             //     [
//             //       req.files[file].name,
//             //       req.files[file].data,
//             //       req.files[file].mimetype,
//             //       req.body.folder*1,
//             //     ],(err,result)=>{
//             //         if(err) console.log(err)
//             //         console.log(result)
//             //     });

//             let objFile = {
//                 fileName: req.files[file].name,
//                 fileData: req.files[file].data,
//                 fileType: req.files[file].mimetype,
//                 folder_fk: req.body.folder*1,
//             }
//                 files.push(objFile)

//             }

//         }
//         res.sendStatus(200)
        

// }

// module.exports = {
//     imgFiles
// }