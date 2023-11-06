//import { Router } from 'express';
//imports models for mongoose
import MyRouter from '../router.js';
import CartsController from '../../controllers/carts.controller.js';
import ProductsController from '../../controllers/products.controller.js';
import passport from 'passport';
import cart_user_role from '../../middlewares/cart_user_role.js';

const controller = new CartsController();
const productsController = new ProductsController();

export default class CartsRouter extends MyRouter {
    init() {
        this.post(
            '/', 
            ["USER"],
            cart_user_role,
            async (req, res, next) => {
                try {
                    let user = req.user;
                    let data = req.body;
                    data.user_id = user._id;
                    let product = await productsController.readOne(data.product_id)
                    data.price = product.response.price
                    let response = await controller.create(data);
                        return res.sendSuccessCreate(response); 
                } catch (error) {
                    next(error)
                }
            }
        )
        this.read(
            '/', 
            ["USER"], 
            passport.authenticate("current"), 
            async (req, res, next) => {
                try {
                    let user_id = req.user._id;
                    let state = "pending";
                    if (req.query.state) {
                        state = req.query.state;
                    }
                    let response = await controller.readByUser(user_id, state);
                    response ? res.sendSuccess(response) : res.sendNotFound('cart');
                } catch (error) {
                    next(error);
                }
            }
        )
        this.read(
            '/total',
            ["USER"],
            passport.authenticate("current"),
            async (req, res, next) => {
                try {
                    let id = req.user._id;
                    let total = await controller.getTotal(id);
                    total ? res.sendSuccess(total) : res.sendNotFound(0);
                } catch (error) {
                    next(error);
                }
            }
        )
        this.put(
            '/:cid', 
            ["USER"],
            passport.authenticate("current"),
            async (req, res, next) => {
                try {
                    let cart_id = req.params.cid;
                    let data = req.body;
                    let response = await controller.update(cart_id, data);
                    response ? res.sendSuccess(response) : res.sendNotFound('product in cart');
                } catch (error) {
                    next(error);
                }
            }
        )

        this.delete(
            '/:cid',
            ["USER"],
            passport.authenticate("current"),
            async (req, res, next) => {
                try {
                    let cart_id = req.params.cid;
                    let response = await controller.delete(cart_id);
                    response ? res.sendSuccess(response) : res.sendNotFound('cart');
                } catch (error) {
                    next(error);
                }
            }
        )

        this.delete(
            '/',
            ["USER"],
            passport.authenticate("current"),
            async (req, res, next) => {
                try {
                    let user = req.user;
                    let response = await controller.deleteAll(user._id);
                    response ? res.sendSuccess(response) : res.sendNotFound('cart');
                } catch (error) {
                    next(error);
                }
            }
        )
    }
}
/* 

cartsRouter.get('/bills/:cid', async (req, res, next) => {
    try {
        const { cid } = req.params;
        const cart = await Cart.findById(cid).populate({path: "products.product", select: "price"}).lean();
        const totalMount = cart.products.reduce((acc, item) => acc + item.product.price * item.quantity, 0)
        console.log(totalMount)
        return res.status(200).json({
            success: true,
            payload: totalMount
        })
    } catch (error) {
        next(error)
    }
})

// delete produtc
cartsRouter.delete('/:cid/product/:pid', async (req, res, next) => {
    try {
        const { cid, pid } = req.params;
        const product = await Product.findById(pid);
        const cart = await Cart.findById(cid);
        let products = cart.products;
        let isInCart = products.find(e => e.product == pid);
        let newCart;
        if(!isInCart){
            return res.status(404).json({
                sucess: false,
                message: `Product id: ${pid}, is not in cart!`
            })
        } else {
            if(isInCart.quantity > 1){
                const filteredCart = products.filter(e => e.product != pid);
                isInCart.quantity = isInCart.quantity - 1;
                await Cart.findByIdAndUpdate(cid, {products: [...filteredCart, isInCart]});
                newCart = await Cart.findById(cid)
            } else {
                const filteredCart = products.filter(e => e.product != pid);
                await Cart.findByIdAndUpdate(cid, {products: filteredCart});
                newCart = await Cart.findById(cid)
            }
            return res.status(200).json({
                success: true,
                message: `Product ${pid} removed!`,
                payload: newCart
            })
        }
    } catch (error) {
        next(error)
    }
})

// delete cart
cartsRouter.delete('/:cid', async (req, res, next) => {
    try {
        let { cid } = req.params
        await Cart.findByIdAndDelete(cid)      
        return res.status(200).json({
            success: true,
            message: `Cart ${cid} deleted`
        })
    } catch (error) {
        next(error)
    }
})

 */