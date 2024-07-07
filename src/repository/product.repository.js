//Repository: Se conecta con la bdd, con la persistencia de la información
const ProductsModel = require("../models/products.model");
const { logger } = require("../utils/logger.js");

class ProductRepository {
    async addProduct({ title, description, price, img, code, stock, category, thumbnails }) {
        try {
            if (!title || !description || !price || !code || !stock || !category) {
                logger.error("Todos los campos son obligatorios");
                return;
            }
            const existingProduct = await ProductsModel.findOne({ code: code });
            if (existingProduct) {
                throw new Error("El código debe ser único");
            }
            const newProduct = new ProductsModel({
                title,
                description,
                price,
                img,
                code,
                stock,
                category,
                status: true,
                thumbnails: thumbnails || []
            });
            await newProduct.save();
            logger.info(`Producto agregado exitosamente: ${JSON.stringify(newProduct.toObject(), null, 2)}`);
            return newProduct;
        } catch (error) {
            logger.error("Error al agregar un producto", error);
            throw error;
        }
    }


    async getProducts() {
        try {
            const products = await ProductsModel.find();
            logger.info("Productos recuperados exitosamente", { count: products.length });
            return products;
        } catch (error) {
            logger.error("Error al obtener los productos:", error);
            throw error;
        }
    }

    async getProductById(id) {
        try {
            const product = await ProductsModel.findById(id);
            if (!product) {
                logger.warning(`Producto con ID "${id}" no encontrado`);
                return null;
            } else {
                logger.info(`Producto encontrado exitosamente: ${JSON.stringify(product.toObject(), null, 2)}`);
                return product;
            }
        } catch (error) {
            logger.error("Error al encontrar producto por ID:", error);
            throw error;
        }
    }

    async updateProduct(id, updatedFields) {
        try {
            const updatedProduct = await ProductsModel.findByIdAndUpdate(id, updatedFields, { new: true });
            if (!updatedProduct) {
                logger.warning("Producto no encontrado");
                return null;
            }
            logger.info(`Producto actualizado exitosamente: ${JSON.stringify(updatedProduct.toObject(), null, 2)}`);
            return updatedProduct;
        } catch (error) {
            logger.error("Error al actualizar Producto:", error);
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            const deletedProduct = await ProductsModel.findByIdAndDelete(id);
            if (!deletedProduct) {
                logger.warning("Producto no encontrado");
                return null;
            }
            logger.info(`Producto eliminado exitosamente: ${JSON.stringify(deletedProduct.toObject(), null, 2)}`);
            return deletedProduct;
        } catch (error) {
            logger.error("Error al eliminar Producto:", error);
            throw error;
        }
    }
}

module.exports = ProductRepository;


