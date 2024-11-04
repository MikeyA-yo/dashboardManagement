const router = require("express").Router();
const {
  seeLaundryEntries,
  addLaundryItems,
} = require("../controllers/laundry");

router.route("/").post(addLaundryItems).get(seeLaundryEntries);

module.exports = router;
