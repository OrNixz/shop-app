// Importing modules and create instance
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const methodOverride = require('method-override');
const ErrorHandler = require('./ErrorHandler')

// Models
const Product = require('./models/product')

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1/shop_db')
    .then((result) => {
        console.log('Connected to MongoDB');
    }).catch((err) => {
        console.log(err)
    });

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
// express.urlencoded() adalah middleware untuk mengambil data dari form. Setelah dibuat, baru express js bisa membaca data dari body request
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
    res.send('Hello World');
})

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
app.post('/products', async (req, res) => {
    const product = new Product(req.body);
    await product.save();
    res.redirect(`/products/${product._id}`);
});
// ---------------------------------------------------------------------
// 1. app.post('/products', async(req, res) => {: Mendefinisikan rute POST ke endpoint ‘/products’. Fungsi ini akan dipanggil setiap kali ada permintaan POST ke ‘/products’. Parameter req dan res mewakili objek permintaan dan respons HTTP. async menunjukkan bahwa ini adalah fungsi asinkron.
// 2. const product = new Product(req.body);: Membuat instance baru dari model Product dengan data dari req.body. req.body berisi data yang dikirim oleh klien dalam badan permintaan HTTP.
// 3. await product.save();: Menyimpan instance product ke database MongoDB. save() adalah metode asinkron, jadi kita menggunakan await untuk menunggu operasi ini selesai sebelum melanjutkan.
// 4. res.redirect(`/products/${product._id}`);: Mengarahkan klien ke rute `/products/${product._id}`. Berarti setelah produk berhasil disimpan, klien akan diarahkan ke halaman detail produk yang baru saja dibuat, bukan ke halaman daftar produk.
// ---------------------------------------------------------------------

// Show Product
app.get('/products/:id', async (req, res, next) => {
    // const product = await Product.findById(req.params.id);
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        res.render('products/show', { product });
    } catch (error) {
        next(new ErrorHandler('Product Not Found', 404))
    }
});

// Edit Product
app.get('/products/:id/edit', async (req, res, next) => {
    // const product = await Product.findById(req.params.id);
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        res.render('products/edit', { product });
    } catch (error) {
        next(new ErrorHandler('Product Not Found', 404))
    }
});

// Update Product
app.put('/products/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndUpdate(id, req.body, { runValidators: true });
        res.redirect(`/products/${product._id}`);
    } catch (error) {
        next(new ErrorHandler('Failed to Update products’roduct', 412))
    }
});

// Delete Product
app.delete('/products/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        await Product.findByIdAndDelete(id);
        res.redirect('/products');
    } catch (error) {
        next(new ErrorHandler('Failed to Delete Product', 404))
    }
})

// Sebagai tambahan taruh products/:id di paling bawah, agar yang dibaca terlebih dahulu adalah parameter create, bukan yang id

// Default Error Handler
app.use((err, req, res, next) => {
    const { status = 500, message = 'Something Went Wrong' } = err
    res.status(status).send(message)
})

app.listen(3000, () => {
    console.log('Shop App is running on http://127.0.0.1:3000')
})