const router = require("express").Router();
const { addDrink, seeDrinks } = require("../controllers/drinks");

router.route("/").post(addDrink).get(seeDrinks);

module.exports = router;
