const router = require("express").Router();
const { addDrink, seeDrinks, clearDrinks } = require("../controllers/drinks");

router.route("/").post(addDrink).get(seeDrinks).delete(clearDrinks);

module.exports = router;
