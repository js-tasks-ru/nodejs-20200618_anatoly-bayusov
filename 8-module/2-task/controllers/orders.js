const Order = require('../models/Order');
const sendMail = require('../libs/sendMail');

module.exports.checkout = async function checkout(ctx, next) {
  const {product,
    phone,
    address
  } =  ctx.request.body;
  
  const user = ctx.user._id;
  const email = ctx.user.email;
  
  const order = new Order({user, product, phone, address});
  
  try {
    const orderSave = await order.save();
    const orderSaved = await Order.findOne({_id: order._id}).populate('product');
  
    const mail = await sendMail({
      template: 'order-confirmation',
      locals: {id: order._id, product: {title: orderSaved.product.title}},
      to: email,
      subject: 'Подтвердите почту',
    });
  
    ctx.body = {order: order._id};
    ctx.status = 200;
  } catch(err) {
    ctx.status = 400;
    ctx.body = { errors: {
        product: 'required',
        phone: 'Неверный формат номера телефона.',
        address: 'required'
      }};
  }
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
  const user = ctx.user._id;
  const orders = await Order.find({user: user});
  ctx.body = {orders};
  ctx.status = 200;
};
