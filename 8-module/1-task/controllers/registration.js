const uuid = require('uuid/v4');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
  const token = uuid();
  
  const {email, displayName, password} = ctx.request.body;
  const userFounded = await User.findOne({ email: email }).catch(err => undefined);

  if (userFounded) {
    ctx.status = 400;
    ctx.body = {errors: {email: 'Такой email уже существует'}};
  } else {
    const user = new User({email, displayName, verificationToken: token});
    await user.setPassword(password);
    await user.save();
  
    const mail = await sendMail({
      template: 'confirmation',
      locals: {token: 'token'},
      to: email,
      subject: 'Подтвердите почту',
    });
    
    ctx.body = {status: 'ok'};
    ctx.status = 200;
  }
  
};

module.exports.confirm = async (ctx, next) => {
  const {verificationToken} = ctx.request.body;
  
  const userFounded = await User.findOne({ verificationToken: verificationToken }).catch(err => undefined);
  
  if (!userFounded) {
    ctx.throw(400, 'Ссылка подтверждения недействительна или устарела')
  } else {
    await User.findOneAndUpdate({ verificationToken: verificationToken }, {$unset : {verificationToken: ''}})
  
    ctx.body = {token: userFounded.verificationToken};
  }
  

};
