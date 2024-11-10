const router = require("express").Router();
const { addPool, seePools, clearPools } = require("../controllers/pools");

router.route("/").get(seePools).post(addPool).delete(clearPools);

module.exports = router;
