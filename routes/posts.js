const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const postsController = require("../controllers/posts");
const { ensureAuth } = require("../middleware/auth");

//Post Routes - simplified for now
router.get("/:id", ensureAuth, postsController.getPost);

router.post("/createBundle", upload.single("file"), postsController.createBundle);

router.put("/saveBundle/:id", postsController.saveBundle);
router.put("/purchaseBundle/:id", postsController.purchaseBundle);

router.delete("/deletePost/:id", postsController.deletePost);

module.exports = router;
