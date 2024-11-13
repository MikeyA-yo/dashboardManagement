const Pool = require("../models/Pool");

// adding a new pool info
const addPool = async (req, res) => {
  try {
    const requiredFields = ["fullName", "hours", "totalCost"];
   const {fullName, hours, hotelAccessories, totalCost, date, username, edit, _id, isPrint} = req.body
    // const missingFields = requiredFields.some((field) => !req.body[field]);
     if(edit && isPrint && _id && (!fullName || !hours ||  !totalCost)){
        let p = await Pool.updateOne({_id}, {isPrint});
        return res.status(200).json({message:p})
     }
    if (!fullName || !hours ||  !totalCost) {
      return res
        .status(400)
        .json({ message: "Please fill all necessary fields" });
    }
    let pl
    if(!edit){
      const pool = new Pool({fullName, hours, totalCost,hotelAccessories, date, username})
      await pool.save()
      pl = pool
    }else{
      pl = await Pool.updateOne({ _id}, {fullName, hours, totalCost,hotelAccessories})
    }
    res.status(201).json({ message: "Successfully added pool", pl });
  } catch (err) {
    res.status(500).json({ message: "Failed to add", error: err.message });
  }
};

const seePools = async (req, res) => {
  try {
    const pools = await Pool.find({});
    res.status(200).json(pools);
  } catch (err) {
    res.status(500).send({ message: "Failed to get", error: err.message });
  }
};
const clearPools = async (rq,rs)=>{
  try{
    await Pool.deleteMany({})
    rs.status(200).json({message:"clear success"})
  }catch(e){
    rs.status(500).send({ message: "Failed to clear", error: e.message });
  }
}
module.exports = { seePools, addPool, clearPools };
