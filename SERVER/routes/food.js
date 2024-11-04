const router = require("express").Router();
const { addFood, seeAddedFood } = require("../controllers/food");

router.route("/").get(seeAddedFood).post(addFood);

module.exports = router;
