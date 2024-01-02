// Importing modules and create instance
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const app = express();
const methodOverride = require('method-override');
const ErrorHandler = require('./ErrorHandler')

// Models
const Product = require('./models/product')
const Garment = require('./models/garment')

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1/shop_db')
    .then((result) => {
        console.log('Connected to MongoDB');
    }).catch((err) => {
        console.log(err)
    });

// Middleware
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
// express.urlencoded() adalah middleware untuk mengambil data dari form. Setelah dibuat, baru express js bisa membaca data dari body request
app.use(methodOverride('_method'));
app.use(session({
    secret: 'keyboard-cat',
    resave: false,
    saveUninitialized: false
}))
app.use(flash())

app.use((req, res, next) => {
    res.locals.flash_messages = req.flash('flash_messages')
    next();
})

function wrapAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(err => next(err))
    }
}
// Wrapper berguna untuk menghindari penulisan try-catch berulang kali di setiap route.

app.get('/', (req, res) => {
    res.send('Hello World');
})

// ======================================================================
//                                Garment
// ======================================================================

// Garment Index
app.get('/garments', wrapAsync(async (req, res) => {
    const garments = await Garment.find({});
    res.render('garment/index', { garments });
}))

// Create Garment
app.get('/garments/create', (req, res) => {
    res.render('garment/create')
})

// Save Garment
app.post('/garments', wrapAsync(async (req, res) => {
    const garment = new Garment(req.body)
    await garment.save()
    req.flash('flash_messages', 'Success added new garment!')
    res.redirect(`/garments`)
}))

// Show Garment
app.get('/garments/:id', wrapAsync(async (req, res) => {
    const { id } = req.params
    const garment = await Garment.findById(id).populate('products')
    // res.send(garment)
    res.render('garment/show', { garment })
}))

// Create Product based on Garment ID
app.get('/garments/:garment_id/products/create', (req, res) => {
    const { garment_id } = req.params
    res.render('products/create', { garment_id })
})

// Save Product based on Garment ID
app.post('/garments/:garment_id/products', wrapAsync(async (req, res) => {
    const { garment_id } = req.params
    const garment = await Garment.findById(garment_id)
    const product = new Product(req.body)
    garment.products.push(product)
    product.garment = garment
    await garment.save()
    await product.save()
    console.log(garment)
    res.redirect(`/garments/${garment_id}`)
}))

// Delete Garment
app.delete('/garments/:garment_id', wrapAsync(async (req, res) => {
    const { garment_id } = req.params
    await Garment.findByIdAndDelete({ _id: garment_id })
    res.redirect('/garments')
}))

// ======================================================================
//                                Products
// ======================================================================

// Product Index
app.get('/products', async (req, res) => {
    const { category } = req.query;
    if (category) {  // Jika ada query category
        const products = await Product.find({ category });
        res.render('products/index', { products, category });
    } else {  // Jika tidak ada query category
        const products = await Product.find({});
        res.render('products/index', { products, category: 'All' });
    }
});

// Create Product
app.get('/products/create', async (req, res) => {
    // throw new ErrorHandler('This is a custom error', 503)
    res.render('products/create')
});

// Save Product
app.post('/products', wrapAsync(async (req, res) => {
    const product = new Product(req.body);
    await product.save();
    res.redirect(`/products/${product._id}`);
}));

// ---------------------------------------------------------------------
// 1. app.post('/products', async(req, res) => {: Mendefinisikan rute POST ke endpoint ‘/products’. Fungsi ini akan dipanggil setiap kali ada permintaan POST ke ‘/products’. Parameter req dan res mewakili objek permintaan dan respons HTTP. async menunjukkan bahwa ini adalah fungsi asinkron.
// 2. const product = new Product(req.body);: Membuat instance baru dari model Product dengan data dari req.body. req.body berisi data yang dikirim oleh klien dalam badan permintaan HTTP.
// 3. await product.save();: Menyimpan instance product ke database MongoDB. save() adalah metode asinkron, jadi kita menggunakan await untuk menunggu operasi ini selesai sebelum melanjutkan.
// 4. res.redirect(`/products/${product._id}`);: Mengarahkan klien ke rute `/products/${product._id}`. Berarti setelah produk berhasil disimpan, klien akan diarahkan ke halaman detail produk yang baru saja dibuat, bukan ke halaman daftar produk.
// ---------------------------------------------------------------------

// Show Product
app.get('/products/:id', wrapAsync(async (req, res) => {
    // const product = await Product.findById(req.params.id);
    const { id } = req.params;
    const product = await Product.findById(id).populate('garment');
    // res.send(product)
    res.render('products/show', { product });
}));

// Edit Product
app.get('/products/:id/edit', wrapAsync(async (req, res) => {
    // const product = await Product.findById(req.params.id);
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render('products/edit', { product });
}));

// Update Product
app.put('/products/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, { runValidators: true });
    res.redirect(`/products/${product._id}`);
}));

// Delete Product
app.delete('/products/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.redirect('/products');
}));

// Sebagai tambahan taruh products/:id di paling bawah, agar yang dibaca terlebih dahulu adalah parameter create, bukan yang id

const validatorHandler = err => {
    err.status = 400
    err.message = Object.values(err.errors).map(item => item.message)
    return new ErrorHandler(err.message, err.status)
}

// Filter Error Handler
app.use((err, req, res, next) => {
    console.dir(err)
    if (err.name === 'ValidationError') err = validatorHandler(err)
    if (err.name === 'CastError') {
        err.status = 404
        err.message = 'Product is not found'
    }
    next(err)
})

// Default Error Handler
app.use((err, req, res, next) => {
    const { status = 500, message = 'Something Went Wrong' } = err
    res.status(status).send(message)
})

app.listen(3000, () => {
    console.log('Shop App is running on http://127.0.0.1:3000')
})