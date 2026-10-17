# ShopEase — E-commerce Frontend

A responsive demo storefront built using **HTML, CSS and vanilla JavaScript**. No backend, framework, or database is required.

## Features

- Responsive layout for desktop, tablet and mobile
- Product catalogue with sample products and product cards
- Search by product name, category or description
- Category filters and sorting by price or rating
- Shopping cart drawer with add, remove and quantity controls
- Automatic subtotal and cart item count
- Newsletter form demo with confirmation message
- Account information modal
- Toast notifications and empty-search state
- Sample product images loaded from Unsplash (internet connection required)

## Run the website

1. Extract the ZIP file.
2. Open the `ecommerce_frontend` folder in VS Code.
3. Open `index.html` in your browser, or use the **Live Server** extension in VS Code.
4. Browse products and try the search, filters and cart.

## Folder structure

```text
ecommerce_frontend/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── products.js
│   └── script.js
└── README.md
```

## Important

This is a **frontend-only project**. Cart data exists only in the current page session and is not stored in a database. Login, orders, real checkout, payment, and email subscription are demonstration interactions only. Product images and Google Fonts require an internet connection.

## Next step

A backend can be added later using Python Flask and MySQL to store users, products, cart items, and orders.
