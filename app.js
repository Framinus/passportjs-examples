// Written with help from Stephen Grider's Advanced React and Redux Udemy Course

require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser');
const passport = require('passport')
const passportService = require('./services/passport')
const Authentication = require('./controllers/authentication')

const app = express()
app.use(bodyParser.json())

/////////// sign in /////////////
// middleware for before signin route -- don't let them in unless they have
// a correct email / password
const requireSignin = passport.authenticate('local', { session: false })
app.post('/signin', requireSignin, Authentication.signin)

///////// protected route ///////////
// passport middleware
// { session: false } means don't create a session, since we're using jwt, not cookies
const requireAuth = passport.authenticate('jwt', { session: false })

app.get('/protected', requireAuth, (req, res) => {
  res.json({ message: 'The secret word is sasquatch' })
})

app.listen(3000, () =>
  console.log('Authenticating on port 3000!')
)