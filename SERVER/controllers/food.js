const Food = require("../models/Food");

const addFood = async (req, res) => {
  try {
    const {
      roomNo,
      foodTypes,
      foodAmounts,
      paymentMethod,
      serviceLocation,
      totalAmount,
      edit,
      _id,
      isPrint
    } = req.body;
    if (edit && _id && isPrint && (
      !roomNo ||
      !foodTypes ||
      !foodAmounts ||
      !paymentMethod ||
      !serviceLocation ||
      !totalAmount
    )){
      let f = await Food.updateOne({_id},{isPrint});
      return res.status(200).json({message:f})
    }
    if (
      !roomNo ||
      !foodTypes ||
      !foodAmounts ||
      !paymentMethod ||
      !serviceLocation ||
      !totalAmount
    ) {
      return res
        .status(400)
        .json({ message: "Please fill all required fields" });
    }
    let fd;
    if(!edit){
      const food = new Food({ roomNo, foodTypes, foodAmounts, paymentMethod, serviceLocation, totalAmount });
      await food.save()
      fd = food
    }else{
      fd = await Food.find({})
      await Food.updateOne({_id}, {roomNo, foodTypes, foodAmounts, paymentMethod, serviceLocation, totalAmount})
    }
    let food = fd
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

const clearFood = async (req, res) =>{
  try{
    await Food.deleteMany({})
    res.status(200).json({message:"Food cleared successfuly"})
  }catch(e){
    return res
      .status(500)
      .json({ message: "Failed to clear food", error: err.message });
  }
}
module.exports = { addFood, seeAddedFood, clearFood };
