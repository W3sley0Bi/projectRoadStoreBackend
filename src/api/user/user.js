const config = require('../../../config');
const db = require('../../modules/DBConnection');

async function workers (req,res,next){
    try{
        const result = await db.query(`SELECT role_fk,idUser,name,surname FROM user WHERE access_token = ?`,[req.header("Authorization")]);
        if(!Object.keys(result[0]).length === 0) return res.status(401).json({ message: `No token found`});
        const data = result[0][0];
        if(data.role_fk == 1) return res.status(200).json({
            id:data.idUser,
            username:data.name,
            surname:data.surname
        })
    }catch(err){
        res.status(400).json({ message: err.message });
        next(err);
    }
}

module.exports = {
	workers
};