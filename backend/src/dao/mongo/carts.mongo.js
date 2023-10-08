import { response } from "express";
import Cart from "./models/carts.js";

export default class CartMongo {
    constructor() {}
    async create(data) {
        let cart = await Cart.create(data);
        return {
            message: "Product added.",
            response: { store_id: cart._id }
        }
    }
    async readByUser(user_id, state) {
        let all = await Cart.find(
            { user_id, state }, 
            "product_id user_id quantity state"
        )
            .populate('user_id', 'first_name last_name mail photo')
            .populate('product_id', '-createdAt -updatedAt -__v');
        
        if (all.length > 0) {
            return {
                message: "products found.",
                respone: { products: all }
            }
        } else {
            return null;
        }
    }
    async update(id, data) {
        let one = await Cart.findByIdAndUpdate(id, data, {new: true});

        if(one) {
            return {
                message: "product updated.",
                respone: one
            }
        } else {
            return null;
        }
    }
    async delete(id) {
        let one = await Cart.findByIdAndDelete(id)
            .select("product_id user_id quantity state")
            .populate("user_id", "first_name last_name mail photo")
            .populate("product_id", "-createdAt -updatedAt -__v");
        if (one) {
            return {
                message: "product deleted.",
                response: one
            }
        } else {
            return null;
        }
    }
    async deleteAll(user_id) {
        let all = await Cart.deleteMany({ user_id: user_id })
        console.log(all)
        if(all.deletedCount > 0) {
            return {
                message: "carts deleted.",
                response: all
            }
        } else {
            return null;
        }
    }
        
}