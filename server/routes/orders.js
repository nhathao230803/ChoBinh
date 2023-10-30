import express from "express";
import { requireRole } from "../middlewares/auth.js";
import Order from "../models/Order.js";
import ProductOrder from "../models/ProductOrder.js";
import User from "../models/User.js";

import {
  MessageResponse,
  DataResponse,
  Response,
  InternalErrorResponse,
  NotFoundResponse,
  ErrorResponse,
  UnAuthorizedResponse,
} from "../common/reponses.js";

const router = express.Router();

router.post("/", requireRole("US"), async (req, res) => {
  const orderData = req.body;
  const userId = res.locals.userData.id;

  console.log(
    orderData.Note,
    orderData.deliveryId,
    orderData.paymentMethod,
    orderData.products
  );

  try {
    const order = await Order.create({
      deliveryId: orderData.deliveryId,
      userId: userId,
      note: orderData.Note,
      paymentMethod: orderData.paymentMethod,
    });

    orderData.products.forEach(async (product) => {
      await ProductOrder.create({
        productId: product.id,
        quantity: product.quantity,
        orderId: order.id,
      });
    });

    res.json(
      DataResponse({
        orderId: order.id,
      })
    );
  } catch (err) {
    console.log(err);
    res.json(InternalErrorResponse());
  }
});

export default router;
