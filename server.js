
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 10000;

// Locate the frontend whether files are flat or in separate folders.
const nestedFrontend = path.join(__dirname, '../frontend');
const frontendDir = fs.existsSync(
    path.join(nestedFrontend, 'index.html')
) ? nestedFrontend : __dirname;

app.use(cors());
app.use(express.json());
app.use(express.static(frontendDir));

// Homepage for judges
app.get('/', (req, res) => {
    res.sendFile(path.join(frontendDir, 'index.html'));
});

// Sample inventory
let inventoryDatabase = [
    {
        id: 1,
        name: 'Amul Taaza Milk',
        stock: 120,
        price: 32,
        expiry: '1 Days'
    },
    {
        id: 2,
        name: 'Farm Fresh Desi Tomatoes',
        stock: 85,
        price: 40,
        expiry: '2 Days'
    }
];

// Inventory API
app.get('/api/inventory', (req, res) => {
    res.json({
        success: true,
        data: inventoryDatabase
    });
});

// Checkout API
app.post('/api/checkout', (req, res) => {
    const items = req.body?.items;

    if (!Array.isArray(items)) {
        return res.status(400).json({
            success: false,
            message: 'A valid items array is required.'
        });
    }

    for (const item of items) {
        const product = inventoryDatabase.find(
            p => p.id === item.id
        );

        if (product && Number.isInteger(item.quantity) &&
            item.quantity > 0) {
            product.stock = Math.max(
                0, product.stock - item.quantity
            );
        }
    }

    res.json({
        success: true,
        message: 'Inventory synchronized successfully.'
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`FreshSense AI running on port ${PORT}`);
});
