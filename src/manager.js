import { ProductManager } from "./ProductManager.js";

let miPrimeraTienda = new ProductManager("./products.json");
miPrimeraTienda.getProducts().then((data) => {
    console.log(data);
});

/*miPrimeraTienda.addProduct(
    "Cereal",
    "Cereal de arroz",
    200,
    "sin imagen",
    "001",
    10
);
miPrimeraTienda.addProduct(
    "Mantequilla de mani",
    "Mantequilla de mani",
    200,
    "sin imagen",
    "002",
    10
);
miPrimeraTienda.addProduct(
    "Aceite de girasol", 
    "Aceite de girasol",
    200,
    "sin imagen",
    "003",
    10
); */