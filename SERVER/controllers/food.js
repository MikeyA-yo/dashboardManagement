const Food = require("../models/Food");

const addFood = async (req, res) => {
  try {
    const {
      roomNumber,
      typeOfFood,
      beverageOrWater,
      paymentMethod,
      serviceLocation,
      totalAmount,
    } = req.body;
    if (
      !roomNumber ||
      !typeOfFood ||
      !beverageOrWater ||
      !paymentMethod ||
      !serviceLocation ||
      !totalAmount
    ) {
      return res
        .status(400)
        .json({ message: "Please fill all required fields" });
    }

    const food = await Food.create({ ...req.body });
    return res.status(201).json({ message: "Food successfully added", food });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to add food", error: err.message });
    // throw new Error(err);
  }
};

const seeAddedFood = async (req, res) => {
  try {
    const foods = await Food.find({});
    res.status(200).json({ foods });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to see added food", error: err.message });
  }
};

module.exports = { addFood, seeAddedFood };
