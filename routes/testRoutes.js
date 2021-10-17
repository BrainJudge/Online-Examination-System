const testController = require("../controllers/testController");
const { Router } = require("express");

const router = Router();

//bese url = "/test"
router.get("/getAllTests", testController.getAllTests);
router.get("/getTestById/:testId", testController.getTestById);

module.exports = router;
