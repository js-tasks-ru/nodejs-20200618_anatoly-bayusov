const User = require('../../models/User');

module.exports = function authenticate(strategy, email, displayName, done) {
  if (!email) {
    done(null, false, `Не указан email`);
  } else {
    User.findOne({ email: email }, async function (err, user) {
      if (err) {
        return done(err);
      }
      
      if (!user) {
        const newUser = new User({email, displayName});
        try {
          const newUserSaved = await newUser.save();
          return done(null, newUserSaved);
        } catch(error) {
          return done(error, false);
        }

        
      } else {
        return done(null, user);
      }
    });
  }
};
