// Strategy for the validation of the JWT token

const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const passport = require('passport');
const db = require('./DBConnection');

const config = require('../../config.js');

opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey : config.jwt
}


passport.use(new JwtStrategy(opts,  async function(jwt_payload, done) {
    console.log(jwt_payload);
    const result = await db.query(`SELECT * FROM user WHERE idUser='${jwt_payload.Uid}'`);
    // console.log(result);
    const data = result[0][0];
    if(!Object.keys(result[0]).length === 0){
        return done(err, false);
    }else{
        return done(null,data)
    }
}));

