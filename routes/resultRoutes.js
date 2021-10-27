const { Router } = require("express");
const resultController = require("../controllers/resultController");

const router = Router();

//base url => /result
router.post("/addStatus", resultController.addTestStatus);
router.post("/getStatus", resultController.getStatus);
router.post("/submitAnswer", resultController.submitAnswer);
router.get("/getStandings/:testId", resultController.getStandings);
router.post("/getMyResult", resultController.getMyResult);

module.exports = router;