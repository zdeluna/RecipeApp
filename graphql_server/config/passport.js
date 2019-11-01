// Consulted https://scotch.io/@devGson/api-authentication-with-json-web-tokensjwt-and-passport
// https://scotch.io/tutorials/easy-node-authentication-setup-and-local#toc-handling-signupregistration
require("dotenv").config();
let passport = require("passport");
let localStrategy = require("passport-local").Strategy;
let User = require("../models/user");
let JWTstrategy = require("passport-jwt").Strategy;
let ExtractJWT = require("passport-jwt").ExtractJwt;
let googleStrategy = require("passport-google-oauth20").Strategy;
let bcrypt = require("bcrypt");

passport.use(
  "signup",
  new localStrategy(async function(username, password, done) {
    try {
      User.findOne({ username: username }, async function(err, user) {
        // Return any errors
        if (err) return done(err);

        // If a user doesn't exist, create one in the database
        if (!user) {
          // Hash the password, so that it is not easily read from the database
          const hash = await bcrypt.hash(password, 10);

          var user = new User({
            username: username,
            password: hash
          });
          user.save(function(err) {
            return done(err, user);
          });
        }

        // Otherwise, the uer already exists in the database
        else {
          done(null, null, {
            errors: { msg: "USER_ALREADY_CREATED" }
          });
        }
      });
    } catch (error) {
      done(error);
    }
  })
);

passport.use(
  "login",
  new localStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return done(null, false, { msg: "USER_IS_NOT_FOUND" });
      }

      const isPasswordCorrect = await user.isCorrectPassword(password);

      if (!isPasswordCorrect) {
        return done(null, false, { errors: { msg: "INVALID_PASSWORD" } });
      }

      // Send the user to the next next middleware
      return done(null, user, { message: "Logged in" });
    } catch (error) {
      return done(error);
    }
  })
);

// Make sure token is valid when user is trying to make requests
// to the API
passport.use(
  new JWTstrategy(
    {
      // Extract the jwt token located in the authorization header
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
    },
    async (token, done) => {
      try {
        return done(null, token.user);
      } catch (error) {
        done(error);
      }
    }
  )
);
