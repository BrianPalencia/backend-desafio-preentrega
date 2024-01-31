import express from "express";
import { Server } from "socket.io";
import mongoose from "mongoose";
import dotenv from "dotenv";
import productRouter from "./routes/products.router.js";
import cartRouter from "./routes/cart.router.js";
import handlebars from "express-handlebars";
import viewsRouter from "./routes/views.router.js";
import { __dirname } from "./utils.js";
import { ProductManager } from "./classes/ProductManager.js";
import MongoStore from "connect-mongo";
import session from "express-session";
import cookieParser from "cookie-parser";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import loginRouter from "./routes/login.router.js";
import signupRouter from "./routes/signup.router.js";
import sessionRouter from "./routes/session.router.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
const productManager = new ProductManager("productos.json");
const COOKIESECRET = process.env.CODERSECRET;

const DB_URL = process.env.DB_URL || "mongodb://127.0.0.1:27017/ecommerce";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/public"));

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);
app.use("/", viewsRouter);

const server = app.listen(PORT, () => {
    console.log("servidor esta corriendo en el puerto " + PORT);
});

mongoose
    .connect(DB_URL)
    .then(() => {
        console.log("Base de datos conectada a " + DB_URL);
    })

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(COOKIESECRET));
app.use(express.static(__dirname + "/public"));

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use(
    session({
        store: MongoStore.create({
            mongoUrl: DB_URL,
            mongoOptions: {
                useNewUrlParser: true,
            },
            ttl: 600,
        }),
        secret: COOKIESECRET,
        resave: false,
        saveUninitialized: true,
    })
);

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use("/", sessionRouter);
app.use("/login", loginRouter);
app.use("/signup", signupRouter);
const environment = async () => {
    try {
        await mongoose.connect(DB_URL);
    } catch (error) {
        console.log(error);
    }
};

environment();

server.on("error", (error) => console.log(error));

const socketServer = new Server(server);

socketServer.on("connection", (socket) => {
    console.log("nuevo cliente conectado");
    socket.on("addProduct", async (product) => {
        const title = product.title;
        const description = product.description;
        const price = product.price;
        const thumbnail = product.thumbnail;
        const code = product.code;
        const stock = product.stock;
        try {
            const result = await productManager.addProduct(
                title,
                description,
                price,
                thumbnail,
                code,
                stock
            );
            const allProducts = await productManager.getProducts();
            console.log(allProducts);
            result && socketServer.emit("updateProducts", allProducts);
        } catch (err) {
            console.log(err);
        }
    });

    socket.on("deleteProduct", async (id) => {
        console.log(id);
        try {
            const result = await productManager.deleteProductById(id);
            const allProducts = await productManager.getProducts();
            console.log(allProducts);
            result && socketServer.emit("updateProducts", allProducts);
        } catch (err) {
            console.log(err);
        }
    });
});