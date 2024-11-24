const Drink = require("../models/Drinks");

const addDrink = async (req, res) => {
  try {
    const requiredFields = [
      "roomNo",
      "drinkTypes",
      "drinkAmounts",
      "paymentMethod",
      "serviceLocation",
      "totalAmount",
    ];
    const {roomNo, drinkTypes, drinkAmounts, paymentMethod, serviceLocation, totalAmount, dateOfEntry , edit, _id, isPrint} = req.body
    if(edit && _id && isPrint && (!roomNo || !drinkTypes || !drinkAmounts || !paymentMethod || !serviceLocation || !totalAmount  || !dateOfEntry)){
      let d = await Drink.updateOne({_id},{isPrint});
      return res.status(200).json({message:d})
    }
     if(!roomNo || !drinkTypes || !drinkAmounts || !paymentMethod || !serviceLocation || !totalAmount || !dateOfEntry){
      return res
          .status(400)
          .json({ message: "Please fill all necessary fields" });
     }
     let drink
    if(!edit){
      const dk = new Drink({roomNo, drinkTypes, drinkAmounts, paymentMethod, serviceLocation, totalAmount,  dateOfEntry});
      dk.save()
      drink = dk
    }else{
      const dk = Drink.find()
      await dk.updateOne({ _id}, {roomNo, drinkTypes, drinkAmounts, paymentMethod, serviceLocation, totalAmount} )
    }
    res.status(200).json({ message: "Successfully added/updateOfEntryd a new drink", drink });
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

const clearDrinks = async (req, res) =>{
  try {
    await Drink.find().deleteMany({})
  } catch (e) {
    res.status(500).json({ message: "Clearing failed", error: err.message });
  }
}
module.exports = { addDrink, seeDrinks, clearDrinks };
