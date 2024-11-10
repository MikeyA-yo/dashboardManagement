const router = require("express").Router();
const { addFood, seeAddedFood, clearFood } = require("../controllers/food");

router.route("/").get(seeAddedFood).post(addFood).delete(clearFood);

module.exports = router;
