const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const postsController = require("../controllers/posts");


 
const { ensureAuth } = require("../middleware/auth");

//Post Routes - simplified for now

router.post("/createBundle", upload.single("file"), postsController.createBundle);

router.put("/addToCart/:id", postsController.addToCart);
router.get("/getCart", postsController.getCart);
router.put("/purchaseBundle/:id", postsController.purchaseBundle);

router.delete("/deletePost/:id", postsController.deletePost);

router.delete("/deleteFromCart/:id",postsController.deleteFromCart)

router.get("/:id", ensureAuth, postsController.getPost);
router.get("/getCancel", postsController.getCancel);
router.get("/getSuccess", postsController.getSuccess);

router.post("/create-checkout-session", postsController.createCheckoutSession)



module.exports = router;
