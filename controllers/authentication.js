const jwt = require('jwt-simple')

/**
 * Generate JSON web token for user
 * @param {object} user - user object with key 'id'
 */
function generateToken(user) {
  const timestamp = new Date().getTime()
  return jwt.encode({ sub: user.id, iat: timestamp }, process.env.SECRET)
}

/**
 * Callback to an express route to authorize a user
 * @function
 * @param {object} req - express request object
 * @param {object} res - express response object
 * @param {function} next - next express middleware function 
 */
const signin = (req, res, next) => {
  // user has already been authorized by previous middleware -- just need to give them a token
  res.send({ 
    token: generateToken(req.user),
  })
}

module.exports = {
  signin,
}