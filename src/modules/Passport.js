// Strategy for the validation of the JWT token

const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const passport = require('passport');
const { db } = require('./DBConnection');

const config = require('../../config.js');

opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey : config.jwt
}


passport.use(new JwtStrategy(opts,  async function(jwt_payload, done) {
    console.log(jwt_payload);
    await db.query(`SELECT * FROM user WHERE idUser='${jwt_payload.Uid}'`,function(err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
            // or you could create a new account
        }
    });
}));

