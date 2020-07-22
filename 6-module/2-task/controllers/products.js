const Product = require('./../models/Product');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const subcategory = ctx.request.query.subcategory;
  if (!subcategory) {
    next();
  } else {
    const products = await Product.find({subcategory: subcategory});
    ctx.body = {products: products
        .map(product => product.toObject())
        .map(product => ({
          title: product.title,
          description: product.description,
          price: product.price,
          category: product.category,
          subcategory: product.subcategory,
          images: product.images,
          id: product._id
        }))}
    next();
  }
};

module.exports.productList = async function productList(ctx, next) {
  const subcategory = ctx.request.query.subcategory;
  let products = [];
  if (subcategory) {
    products = await Product.find({subcategory: subcategory});
  } else {
    products = await Product.find({});
  }
  ctx.body = {products: products
      .map(product => product.toObject())
      .map(product => ({
        title: product.title,
        description: product.description,
        price: product.price,
        category: product.category,
        subcategory: product.subcategory,
        images: product.images,
        id: product._id
      }))}
  next();
};

module.exports.productById = async function productById(ctx, next) {
  const productId = ctx.params.id;
  if (productId.length !== 24) {
    ctx.throw(400, 'Bad request');
  }
  const productObjectId = ObjectId(productId);
  
  const product =
    await Product.findOne({_id: productObjectId}).catch(err => undefined);
  
  if (!product) {
    ctx.throw(404, 'Not found');
  }
  
  const productObj = product.toObject();
  
  ctx.body = {product: {
      ...productObj,
      id: productObj._id
    }};
  next();
};

