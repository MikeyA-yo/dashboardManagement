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
    const {roomNumber, drinkType, beverageType, paymentMethod, serviceLocation, totalAmount, username, date , edit, _id, isPrint} = req.body
    if(edit && _id && isPrint && (!roomNumber || !drinkType || !beverageType || !paymentMethod || !serviceLocation || !totalAmount || !username || !date)){
      let d = await Drink.updateOne({_id},{isPrint});
      return res.status(200).json({message:d})
    }
     if(!roomNumber || !drinkType || !beverageType || !paymentMethod || !serviceLocation || !totalAmount || !username || !date){
      return res
          .status(400)
          .json({ message: "Please fill all necessary fields" });
     }
     let drink
    if(!edit){
      const dk = new Drink({roomNumber, drinkType, beverageType, paymentMethod, serviceLocation, totalAmount, username, date});
      dk.save()
      drink = dk
    }else{
      const dk = Drink.find()
      await dk.updateOne({ _id}, {roomNumber, drinkType, beverageType, paymentMethod, serviceLocation, totalAmount} )
    }
    res.status(200).json({ message: "Successfully added/updated a new drink", drink });
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
