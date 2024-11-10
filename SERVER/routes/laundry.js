const router = require("express").Router();
const {
  seeLaundryEntries,
  addLaundryItems,
  clearLaundries,
} = require("../controllers/laundry");

router.route("/").post(addLaundryItems).get(seeLaundryEntries).delete(clearLaundries);

module.exports = router;
