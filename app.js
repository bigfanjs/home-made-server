const path = require("path");
const express = require("express");
const logger = require("morgan");
const passport = require("passport");
const config = require("config");
const mongoose = require("mongoose");
const JWT = require('jsonwebtoken');

const topics = require("./routes/topics");
const users = require("./routes/users");

const auth = require("./lib/auth");

mongoose.Promise = global.Promise;
mongoose.connect(config.get("db.uri"), config.get("db.opts"));

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// private endpoints
app.use("/api/", passport.authenticate("jwt", {session: false}));

app.get("/api/topics/", topics.getTopics);
app.get("/api/topics/:id", topics.getTopic);
app.post("/api/topics", topics.createTopic);
app.put("/api/topics/:id", topics.updateTopic);
app.delete("/api/topics/:id", topics.deleteTopic);

app.get("/api/users/me", users.getUser);

// facebook authentication
app.post(
    '/auth/facebook/token',
    passport.authenticate('facebook-token', {session: false}),
    function (req, res, next) {
        // do something with req.user
        if (!req.user) {
            return res.send(401, "User Not Authenticated");
        }

        req.auth = {
            id: req.user.id
        };

        next();
    },
    function (req, res, next) {
        req.token = JWT.sign({
            iss: "ApiAuth",
            sub: req.auth.id,
            iat: new Date().getTime(),
            exp: new Date().setDate(new Date().getDate() + 1)
        }, config.get("JWT_SECRET"));
        next();
    },
    function (req, res, next) {
        res.setHeader('x-auth-token', req.token);
        res.status(200).send(req.auth);
    }
);

app.use(function (req, res, next) {
    res.status(req.status || 400).json({ message: req.err });
});

module.exports = app;