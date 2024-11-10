const router = require("express").Router();
const { addEvent, seeEvents, clearEvents } = require("../controllers/events");

router.route("/").post(addEvent).get(seeEvents).delete(clearEvents);

module.exports = router;
