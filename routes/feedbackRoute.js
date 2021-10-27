const { Router } = require("express");
const feedbackController = require("../controllers/feedbackController");
const router = Router();

router.post("/getFeedback", feedbackController.getFeedBack);
router.post("/contact", feedbackController.contact);

module.exports = router;
