const router = require("express").Router();
const { addPool, seePools } = require("../controllers/pools");

router.route("/").get(seePools).post(addPool);

module.exports = router;
