const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const User = require("./models/users")

function initialize(passport, getUserById) {
  const authenticateUser = async (email, password, done) => {

    let user
    getemail(email)
    async function getemail(email) {
      user = await User.find({ email: email })
      // ADD ALERT
      if (user == null) {
        return done(null, false, { message: 'No user with that email' })
      }
      try {
        user = user[ 0 ]
        if (await bcrypt.compare(password, user.password)) {
          return done(null, user)
        } else {
          return done(null, false, { message: 'Password incorrect' })
        }
      } catch (e) {
        return done(e)
      }
    }
  }

  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
  passport.serializeUser((user, done) => done(null, user.id))
  passport.deserializeUser((id, done) => {
    return done(null, getUserById(id))
  })
}

module.exports = initialize