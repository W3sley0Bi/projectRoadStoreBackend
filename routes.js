const express = require('express');
const router = express.Router();
const auth = require('./src/api/auth/auth');
const user = require('./src/api/user/user');
const passport = require('passport');


// passport.authenticate('jwt', { session: false }),


// Auth //////////////////////////////////////////////
router.post('/registration', async (req,res,next) =>{    
   await auth.registration(req,res,next)
});

router.post('/login', async (req,res,next) =>{    
    await auth.login(req,res,next);
});

// Users /////////////////////////////////////////////
router.get('/workers', passport.authenticate('jwt', { session: false }), async (req,res,next) =>{    
    await user.workers(req,res,next);
});

// router.get('/:Uid/addFilesAccess', passport.authenticate('jwt', { session: false }), async (req,res,next) => {
//     await user.addFilesAccess(req,res,next);
// })





module.exports = router;



