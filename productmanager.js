// assessment1

// Graded Assessment: Working with JSON Data

// Problem:

// You are tasked with implementing a product management system. The system will use JSON data for storing information about products. Each product has the following properties:

// · id: Unique identifier for the product.

// · name: Name of the product.

// · category: Category of the product.

// · price: Price of the product.

// · available: Boolean indicating if the product is in stock.

// The tasks below involve reading JSON data, adding new products, updating product information, and filtering products based on certain conditions.


// Tasks:

// 1. Parse the JSON data:

// Write a function that reads the JSON data (in the format above) and converts it into a usable data structure. You will need to parse the JSON into a JavaScript object.

// 2. Add a new product:

// Write a function to add a new product to the catalog. This product will have the same structure as the others and should be appended to the products array.

// 3. Update the price of a product:

// Write a function that takes a product ID and a new price and updates the price of the product with the given ID. If the product doesn’t exist, the function should return an error message.

// 4. Filter products based on availability:

// Write a function that returns only the products that are available (i.e., available: true).

// 5. Filter products by category:

// Write a function that takes a category name (e.g., "Electronics") and returns all products in that category.

const fs = require('fs');
const readline = require('readline');

function loadProducts(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading JSON data:", error);
        return [];
    }
}


function saveProducts(filePath, products) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
    } catch (error) {
        console.error("Error saving JSON data:", error);
    }
}

function addProduct(products, newProduct) {
    products.push(newProduct);
}

function updateProductPrice(products, productId, newPrice) {
    const product = products.find(p => p.id === productId);
    if (product) {
        product.price = newPrice;
    } else {
        console.log("Product not found");
    }
}

function filterAvailableProducts(products) {
    return products.filter(product => product.available);
}

function filterProductsByCategory(products, category) {
    return products.filter(product => product.category === category);
}

function promptNewProduct(filePath, products, callback) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question("Enter product ID: ", (id) => {
        rl.question("Enter product name: ", (name) => {
            rl.question("Enter product category: ", (category) => {
                rl.question("Enter product price: ", (price) => {
                    rl.question("Is the product available? (true/false): ", (available) => {
                        const newProduct = {
                            id: parseInt(id),
                            name: name,
                            category: category,
                            price: parseFloat(price),
                            available: available.toLowerCase() === 'true'
                        };

                        addProduct(products, newProduct);
                        saveProducts(filePath, products);

                        console.log("New product added successfully!");
                        rl.close();
                        callback();
                    });
                });
            });
        });
    });
}


function promptUpdatePrice(products, callback) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question("Enter the product ID to update the price: ", (id) => {
        rl.question("Enter the new price: ", (price) => {
            updateProductPrice(products, parseInt(id), parseFloat(price));
            saveProducts('./products.json', products);
            console.log("Product price updated successfully!");
            rl.close();
            callback();
        });
    });
}

function mainMenu() {
    const filePath = './products.json';
    let products = loadProducts(filePath);

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    function displayMenu() {
        console.log("\nChoose an option:");
        console.log("1. Add a new product");
        console.log("2. Update product price");
        console.log("3. View available products");
        console.log("4. View products by category");
        console.log("5. Exit");

        rl.question("Enter your choice: ", (choice) => {
            switch (choice) {
                case '1':
                    rl.close();
                    promptNewProduct(filePath, products, mainMenu);
                    break;
                case '2':
                    rl.close();
                    promptUpdatePrice(products, mainMenu);
                    break;
                case '3':
                    console.log("Available Products:", filterAvailableProducts(products));
                    displayMenu();
                    break;
                case '4':
                    rl.question("Enter category to filter by: ", (category) => {
                        console.log("Products in category:", filterProductsByCategory(products, category));
                        displayMenu();
                    });
                    break;
                case '5':
                    rl.close();
                    console.log("Exiting program. Goodbye!");
                    break;
                default:
                    console.log("Invalid choice. Please try again.");
                    displayMenu();
            }
        });
    }

    displayMenu();
}


mainMenu();
