const Laundry = require("../models/Laundry");

const addLaundryItems = async (req, res) => {
  try {
    // Regular checks for existing fields
    const {
      fullName,
      roomNumber,
      numberOfClothes,
      typeOfService,
      paymentMethod,
      totalAmount,
      date,
      edit,
      _id,
      username,
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
    let ltI
    if(!edit){
      const laundryItem = new Laundry({fullName, roomNumber, numberOfClothes, typeOfService, paymentMethod, totalAmount, date, username});
      await laundryItem.save()
      ltI = laundryItem
    }else{
      ltI = await Laundry.updateOne({ _id}, {fullName, roomNumber, numberOfClothes, typeOfService, paymentMethod, totalAmount,})
    }
    res
      .status(201)
      .json({ message: "Laundry items added successfully", ltI });
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

const clearLaundries = async (req, res) =>{
  try{
    await Laundry.deleteMany({})
    res.status(200).json({message:"Cleared successcul"})
  }catch(e){
    res
    .status(500)
    .json({ message: "Failed to clear laundry entries", error: err.message });
  }
}
module.exports = { addLaundryItems, seeLaundryEntries, clearLaundries };
