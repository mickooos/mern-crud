import express from "express";
import * as user from "../controllers/UserController.js";
import * as prod from "../controllers/ProductsController.js";
import { refreshToken } from "../controllers/TokenController.js";
import { isAuth } from "../middlewares/Authentication.js";
import { upload } from "../storage/FileStorage.js";

const router = express.Router();

// User Routes
router.post("/v1/user/register", user.Register);
router.post("/v1/user/login", user.Login);
router.get("/v1/user", isAuth, user.Profile);
router.delete("/v1/user/logout", isAuth, user.Logout);
router.get("/v1/token", refreshToken);
// Product Routes
router.get("/v1/products", isAuth, prod.getProducts);
router.get("/v1/products/:id", isAuth, prod.getProductById);
router.post("/v1/products", isAuth, upload, prod.createProduct);
router.put("/v1/products/:id", isAuth, upload, prod.updateProduct);
router.delete("/v1/products/:id", isAuth, prod.deleteProduct);

export default router;
