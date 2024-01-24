import { productsModel } from "../mongodb/models/products.models.js";

export default class ProductsManager {
    constructor() {
        console.log("Se ha conectado a la base de datos de mongodb");
    }
} 

async getALL() {
    let products = await productsModel.find().lean();
    return products;
}

async getByID(id) {
    let product = await productsModel.findById(id).lean();
    return product;
}

async saveProduct(product) {
    let newProduct = new productsModel(product);
    let result = await newProduct.save();
    return result;
}

async updateProductById(id, product) {
    const result = await productsModel.updateOne({ _id: id }, product);
    return result;
}

async deleteProductById(id) {
    const result = await productsModel.deleteOne({ _id: id });
    return result;
}