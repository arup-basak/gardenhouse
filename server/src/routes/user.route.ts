import express from "express";
import { UserController } from "../controller/user.controller";
import { auth } from "../middlewares/auth.middleware";

const customerRouter = express.Router();
const gardenerRouter = express.Router();

const customerController = new UserController("USER");
const gardenerController = new UserController("GARDENER");

customerRouter.use(auth);
customerRouter.post("/", customerController.createUser);
customerRouter.get("/:id", customerController.getUser);
customerRouter.put("/:id", customerController.updateUser);
customerRouter.delete("/:id", customerController.deleteUser);

gardenerRouter.use(auth);
gardenerRouter.post("/", gardenerController.createUser);
gardenerRouter.get("/:id", gardenerController.getUser);
gardenerRouter.put("/:id", gardenerController.updateUser);
gardenerRouter.delete("/:id", gardenerController.deleteUser);

export { customerRouter, gardenerRouter };