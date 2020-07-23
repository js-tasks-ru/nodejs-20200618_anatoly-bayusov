const Product = require('./../models/Product');

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  const searchString = ctx.query.query;
  const products = await Product.find(({$text: {$search: searchString}}));
  
  ctx.body = {products: products.map(product => product.toObject())
      .map(product => ({
        title: product.title,
        description: product.description,
        price: product.price,
        category: product.category,
        subcategory: product.subcategory,
        images: product.images,
        id: product._id
      }))};
};
