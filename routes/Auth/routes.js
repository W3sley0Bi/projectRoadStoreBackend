const express = require('express');
const router = express.Router();
const api = require('../../src/api/auth/Authentication');

router.post('/registration', async (req,res,next) =>{
    try{
        res.send(await api.registrarion(req.body))
    } catch(err){
        console.error(`Error while getting the queue `, err.message);
        next(err);
    }
});



