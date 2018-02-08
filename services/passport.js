const passport = require('passport')
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt')
const LocalStrategy = require('passport-local')

const USER = { id: 5, email: 'joe@schmo.com', name: 'Joe Schmo' }

/**
 * Fake function to simulate checking user info against the db
 * All it does is return a user obj if email is 'joe@schmo.com' or null otherwise
 * @param {string} email - email to check
 * @param {string} password - password to check
 * @returns {promise} - promise resolving to user object (or null, if credentials don't match)
 */
const fakeCheckUserPassword = (email, password) => {
  if (email === 'joe@schmo.com') {
    return Promise.resolve(USER)
  } 
  return Promise.resolve(null)
}

/**
 * Fake function to simulate checking if email is in db
 * All it does is return a user obj if id is 5, or null otherwise
 * @param {number} id - email to check
 * @returns {promise} - promise resolving to user object (or null, if credentials don't match)
 */
const fakeIsUserIdInDb = (id) => {
  if (id === 5) {
    return Promise.resolve(USER)
  }
  return Promise.resolve(null)
}

/**
 * Function meant to be used as passport strategy callback for the localStrategy
 * @param {string} email 
 * @param {string} password 
 * @param {function} done 
 * @returns {promise} - Promise whose resolution is unimportant
 */
const checkPassword = function(email, password, done) {
  return fakeCheckUserPassword(email, password)
    // can't use findByEmail here because we need hash and salt
    .then((foundUser) => {
      if (foundUser === null) {
        // user not in db or password doesn't match
        return done(null, false)
      }
      // otherwise, all's rosy
      done(null, foundUser)
    })
    .catch(done)
}

// create Local strategy
const localOptions = { usernameField: 'email' }
const localLogin = new LocalStrategy(localOptions, checkPassword)

// Set up options for JWT Strategy
const jwtOptions = {
  // tell it where to find the jwt payload
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),

  // how to decode
  secretOrKey: process.env.SECRET,
}

// Create JWT Strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  // payload is the jwt token object, which we defined with 'sub' and 'iat' properties

  // see if the userId in the payload exists in db. If it does, call done with that user.
  // otherwise, call done without a user object
  return fakeIsUserIdInDb(payload.sub)
    .then(user => {
      user = user || false // translate "null" response into "false"
      done(null, user)
    })
    .catch((err) => done(err, false))
})

// Tell passport to use strategies
passport.use(localLogin)
passport.use(jwtLogin)
