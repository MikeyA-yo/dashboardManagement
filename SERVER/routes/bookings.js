const router = require("express").Router();
const { addBooking, seeBookings, deleteBookings } = require("../controllers/bookings");

router.route("/").post(addBooking).get(seeBookings).delete(deleteBookings);

module.exports = router;
