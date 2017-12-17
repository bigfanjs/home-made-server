const passport = require("passport");
const config = require("config");
const FacebookTokenStrategy = require('passport-facebook-token');
const {ExtractJwt, Strategy: JwtStrategy} = require("passport-jwt");

const User = require("../models/user");

const jwt_keys = {
    jwtFromRequest: ExtractJwt.fromHeader("authorization"),
    secretOrKey: config.get("JWT_SECRET")
};

passport.use(new FacebookTokenStrategy({
    clientID: config.get("fb-auth.clientID"),
    clientSecret: config.get("fb-auth.clientSecret")
},
function (accessToken, refreshToken, profile, done) {
    User.findOne({ 'facebookProvider.id': profile.id }, function (err, user) {
        if (!user) {
            const newUser = User({
                facebookProvider: { id: profile.id, token: accessToken },
                displayName: profile.desplayName
            });

            newUser.save(function (err, savedUser) {
                if (err) console.error(err);

                return done(err, savedUser);
            });
        }

        done(err, user);
    });
}));

passport.use(new JwtStrategy(jwt_keys, async (payload, done) => {
    try {
        const user = await User.findById(payload.sub);

        if (!user) return done(null, false);

        done(null, user);
    } catch (err) {
        done(err, false);
    }
}));