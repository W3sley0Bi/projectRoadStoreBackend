// Strategy for the validation of the JWT token

const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const passport = require('passport');
const {query} = require('./DBConnection')
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../../.env') })

opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey : process.env.SECRETJWT,
}

passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    query(`SELECT * FROM user WHERE idUser='${jwt_payload.Uid}' `, function(err, user) {
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
