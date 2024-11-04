const Laundry = require("../models/Laundry");

const addLaundryItems = (req, res) => {
  try {
    // Regular checks for existing fields
    const {
      fullName,
      roomNumber,
      numberOfClothes,
      typeOfService,
      paymentMethod,
      totalAmount,
    } = req.body;

    if (
      !fullName ||
      !roomNumber ||
      !numberOfClothes ||
      !typeOfService ||
      !paymentMethod ||
      !totalAmount
    ) {
      return res
        .status(400)
        .json({ message: "Please fill out all necessary fields" });
    }

    const laundryItem = Laundry.create({ ...req.body });
    res
      .status(201)
      .json({ message: "Laundry items added successfully", laundryItem });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to add laundry items", error: err.message });
  }
};

const seeLaundryEntries = async (req, res) => {
  try {
    const laundryEntries = await Laundry.find({});
    res.status(200).json(laundryEntries);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch laundry entries", error: err.message });
  }
};

module.exports = { addLaundryItems, seeLaundryEntries };
