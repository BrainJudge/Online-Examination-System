const { Router } = require("express");
const feedbackController = require("../controllers/feedbackController");
const router = Router();

router.post("/getFeedback", feedbackController.getFeedBack);

module.exports = router;
