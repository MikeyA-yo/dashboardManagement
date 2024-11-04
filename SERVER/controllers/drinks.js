const Drink = require("../models/Drinks");

const addDrink = async (req, res) => {
  try {
    const requiredFields = [
      "roomNumber",
      "drinkType",
      "beverageType",
      "paymentMethod",
      "serviceLocation",
      "totalAmount",
    ];

    // Check for if any of the required fields are missing
    const missingFields = requiredFields.some((field) => !req.body[field]);
    if (missingFields) {
      return res
        .status(400)
        .json({ message: "Please fill all necessary fields" });
    }

    const drink = await Drink.create({ ...req.body });
    res.status(200).json({ message: "Successfully added a new drink", drink });
  } catch (err) {
    res.status(500).json({ message: "Failed to add", error: err });
  }
};

const seeDrinks = async (req, res) => {
  try {
    const drinks = await Drink.find({});
    res.status(200).json({ drinks });
  } catch (err) {
    res.status(500).json({ message: "Fetch failed", error: err.message });
  }
};

module.exports = { addDrink, seeDrinks };
