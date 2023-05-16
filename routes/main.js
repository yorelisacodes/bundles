const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const homeController = require("../controllers/home");
const postsController = require("../controllers/posts");
const { ensureAuth } = require("../middleware/auth");

//Main Routes - simplified for now
router.get("/", homeController.getIndex);
router.get("/profile", ensureAuth, postsController.getProfile);
router.get("/seller", ensureAuth, postsController.getSellerProfile);
router.get("/favorites", ensureAuth, postsController.getFavorites);
router.get("/history", ensureAuth, postsController.getHistory);
router.get("/startChat", ensureAuth, postsController.startChat);
router.get("/getChat/:userName", ensureAuth, postsController.getChat);
router.get("/feed", ensureAuth, postsController.getFeed);
router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.get("/logout", authController.logout);
router.get("/signup", authController.getSignup);
router.post("/signup", authController.postSignup);

module.exports = router;
