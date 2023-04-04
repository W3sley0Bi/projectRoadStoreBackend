const { db } = require('../../modules/DBConnection')
const nodemailer = require('nodemailer');
const config = require("../../../config");

const imgFiles = async (req,res,next) => {

        if (req.files) {
            for (const file in req.files) {  
            await db.query("INSERT INTO image (name, bufferData, type,folder_fk) VALUES (?,?,?,?)",
                [
                  req.files[file].name,
                  req.files[file].data,
                  req.files[file].mimetype,
                  req.body.folder*1,
                ]);
            }

        }
        res.sendStatus(200)
 

}

module.exports = {
    imgFiles
}