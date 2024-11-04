const router = require("express").Router();
const { addBooking, seeBookings } = require("../controllers/bookings");

router.route("/").post(addBooking).get(seeBookings);

module.exports = router;
