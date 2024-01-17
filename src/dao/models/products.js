import mongoose from "mongoose";

const productsCollection = "products";

const productsSchema = new mongoose.Schema({
    title:{
        type: String,
        required:true
    },
    description:{
        type: String,
        required:true
    },
    price:{
        type: Number,
        required:true
    },
    stock:{
        type: Number,
        required:true
    }
});

export const productsModel = mongoose.model(productsCollection, productsSchema)