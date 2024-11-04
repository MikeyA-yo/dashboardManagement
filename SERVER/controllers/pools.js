const Pool = require("../models/Pool");

// adding a new pool info
const addPool = async (req, res) => {
  try {
    const requiredFields = ["fullName", "hours", "totalCost"];

    const missingFields = requiredFields.some((field) => !req.body[field]);

    if (missingFields) {
      return res
        .status(400)
        .json({ message: "Please fill all necessary fields" });
    }

    const pool = await Pool.create(req.body);
    res.status(201).json({ message: "Successfully added pool", pool });
  } catch (eventRouter) {
    res.status(500).json({ message: "Failed to add", error: err.message });
  }
};

const seePools = async (req, res) => {
  try {
    const pools = await Pool.find({});
    res.status(200).json(pools);
  } catch (err) {
    res.status(500).send({ message: "Failed to add", error: err.message });
  }
};

module.exports = { seePools, addPool };
