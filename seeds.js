const mongoose = require('mongoose');
const Product = require('./models/product');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1/shop_db')
    .then((result) => {
        console.log('Connected to MongoDB');
    }).catch((err) => {
        console.log(err)
    });

const seedProducts = [
    {
		"name": "Flannel Shirt",
		"brand": "Uniqlo",
		"price": 399000,
		"color": "Light Blue",
		"category": "Mens Clothing"
	},
	{
		"name": "Chino Pants",
		"brand": "Hush Puppies",
		"price": 350000,
		"color": "Cream",
		"category": "Mens Clothing"
	},
	{
		"name": "Sweater",
		"brand": "Polo Ralph Lauren",
		"price": 6200000,
		"color": "BLue",
		"category": "Mens Clothing"
	},
	{
		"name": "Backpack",
		"brand": "Nike",
		"price": 1500000,
		"color": "Green",
		"category": "Bags"
	},
	{
		"name": "Aviator Glasses",
		"brand": "Ray-Ban",
		"price": 2000000,
		"color": "Gold",
		"category": "Accessories"
	},
	{
		"name": "Swimsuit",
		"brand": "Speedo",
		"price": 799000,
		"color": "Black",
		"category": "Swimwear"
	},
	{
		"name": "Baseball Cap",
		"brand": "Tommy Hilfiger",
		"price": 510000,
		"color": "Blue",
		"category": "Accessories"
	},
	{
		"name": "Vest",
		"brand": "The North Face",
		"price": 3250000,
		"color": "Brown",
		"category":  "Mens Clothing"
	},
	{
		"name": "Suit",
		"brand": "Giorgio Armani",
		"price": 1990000,
		"color": "Black",
		"category": "Mens Clothing"
	}
]

Product.insertMany(seedProducts)
    .then((result) => {
        console.log(result)
    }).catch((err) => {
        console.log(err)
    });