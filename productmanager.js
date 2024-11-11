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
