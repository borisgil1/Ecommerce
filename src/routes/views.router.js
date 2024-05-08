const express = require("express");
const router = express.Router();
const ProductManager = require("../controllers/productManager")
const ProductsModel = require("../models/products.model.js");
const productManager = new ProductManager("src/models/productManager.json")

router.get("/products", async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 6;

    try {
        const products = await ProductsModel.paginate({}, { limit, page });
        const final = products.docs.map(products => {
            const { _id, ...rest } = products.toObject();
            return rest;
        })
        res.render("products", {
            user: req.session.user,
            products: final,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            currentPage: products.page,
            totalPages: products.totalPages,
        });

    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" })
    }
});

router.get("/", (req, res) => {
    res.render("home");
})

router.get("/realtimeproducts", (req, res) => {
    res.render("realTimeProducts");
})

router.get("/contacto", (req, res) => {
    res.render("contacto");
})

router.get("/chat", (req, res) => {
    res.render("chat");
})

router.get("/login", (req, res) => {
    res.render("login");
});

router.get("/profile", (req, res) => {
    if (!req.session.login) {
        return res.redirect("/login")
    }
    res.render("profile");
})

router.get("/register", (req, res) => {
    res.render("register");
})

module.exports = router;