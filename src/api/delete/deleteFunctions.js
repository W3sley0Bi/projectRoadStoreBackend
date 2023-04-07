const config = require("../../../config");
const { db } = require("../../modules/DBConnection");


async function deleteFile(req, res, next) {
    const idFile = req.body.idFile
    db.query(`DELETE FROM file WHERE idFile='${idFile}'`,
        (err, result, fields) => {
            if (err) throw err
            
        })

    res.json(200)
}

// async function deleteFolfer(req, res, next) {
//     const idFile = req.body.idFile
//     db.query(`DELETE FROM file WHERE idFile='${idFile}'`,
//         (err, result, fields) => {
//             if (err) throw err
            
//         })

//     res.json(200)
// }

// async function deleteFile(req, res, next) {
//     const idFile = req.body.idFile
//     db.query(`DELETE FROM file WHERE idFile='${idFile}'`,
//         (err, result, fields) => {
//             if (err) throw err
            
//         })

//     res.json(200)
// }



module.exports = {
    deleteFile,
  };
  