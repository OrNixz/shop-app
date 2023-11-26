
# Shop App

Shop App is a simple, modest online store website on which users could perform CRUD operations (create, read, update, and delete products). This project utilizes several tech stacks, such as Node.js, Express Framework, and EJS template engine, and uses the MongoDB database to handle the product data and Mongoose to interact with MongoDB in Node.js. Other than that, users could filter the products by category. 

**Note: Please understand that, due to the project's focus on backend details, I'm not really paying any attention to the interface. I'm so sorry!**

## 1. File Structures
```
.
├── models
│   └── product.js
├── views/products
│   ├── create.ejs
│   ├── edit.ejs
|   ├── index.ejs
|   └── show.ejs
├── .gitignore
├── README.md
├── index.js
├── package-lock.json
├── package.json
└── seeds.js
```

## 2. Key Features
1. Product Index: Displays a list of products, which can sorted by category.
2. Create Product: Add new product by entering information such as its name, brand, color, price, and category.
3. Show Product: See detailed information about a specific product.
4. Edit Product: Update product information, including name, brand, color, price, and category.
5. Delete Product: Removes a product from the database.

## 3. Getting Started
1. Make sure you have already installed Node.js and MongoDB on your system.
2. Clone this repository or download it.
3. Open CMD or Git Bash, then navigate to the project directory that you have downloaded and extracted.
4. Please run `npm install` on the VS Code terminal to install all the required dependencies.
5. You can run MongoDB by entering `mongod` command on the terminal.
6. Run the project by entering `nodemon index.js`
7. After the project is running, you can access the web application by opening the browser and visiting `http://127.0.0.1:3000`.
Note that the default products have already been added using `seeds.js`.




