import { Router } from "express";
import { CartManager } from "../classes/CartManager.js";

const router = Router();
const cartManager = new CartManager("carts.json");

router.get("/", async (req, res) => {
    try {
        let response = await cartManager.find();
        res.json({ data: response });
    } catch (err) {
        res.status(500).json({ status: 'error', error: 'Internal error' });
    }
});

router.get("/:cid", async (req, res) => {
    const { cid } = req.params;
    try {
        const respuesta = await cartManager.getCartById(cid);
        res.json({ data: respuesta });
    } catch (err) {
        res.status(500).json({ status: 'error', error: 'Internal error' });
    }
});
router.post("/:cid/product/:pid'", async (req, res) => {
    try {
        const { cid, pid } = req.params
        const result = await cartManager.updateOne({ _id: cid }, { $push: { products: { product: pid } } })
        res.json({ message: result })
    } catch (error) {
        res.status(500).json({ status: 'error', error: 'Internal error' });
    }
});

router.put('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params
        const { qty } = req.body
        const result = await cartsManager.updateOne({ _id: cid, }, { $set: { 'products.$.quantity': qty }})
        res.json({ message: result })
    } catch (error) {
        res.status(500).json({ status: 'error', error: 'Internal error' });
    }
});

router.delete('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params
        const result = await cartsManager.deleteOne({ _id: cid }, { $pull: { products: { product: pid }}})
        res.json({ message: result })
    } catch (error) {
        res.status(500).json({ status: 'error', error: 'Internal error' });
    }
})

export default router;