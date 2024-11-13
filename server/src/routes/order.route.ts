import { Router } from "express";
import { OrderController } from "../controller/order.controller";
import { auth } from "../middlewares/auth.middleware";

const router = Router();
const orderController = new OrderController();

router.use(auth);

router.get("/", orderController.getAllOrders);
router.get("/:id", orderController.getOrder);
router.post("/", orderController.createOrder);
router.put("/:id", orderController.updateOrderStatus);

export default router;