const router = require("express").Router();
const { addEvent, seeEvents } = require("../controllers/events");

router.route("/").post(addEvent).get(seeEvents);

module.exports = router;
