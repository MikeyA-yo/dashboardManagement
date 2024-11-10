const Event = require("../models/Event");

const addEvent = async (req, res) => {
  try {
    // regular checks for required fields
    const {fullName, phoneNumber, eventType, eventDate, renderedServices, totalCost, date, username, email, edit, _id} = req.body
    const requiredFields = [
      "fullName",
      "phoneNumber",
      "eventType",
      "eventDate",
      "renderedServices",
      "totalCost",
    ];

    // const missingField = requiredFields.some((field) => !req.body[field]);
    if (!fullName || !phoneNumber || !eventType || !eventDate || !renderedServices || !totalCost) {
      return res
        .status(400)
        .json({ message: "Please fill all necessary fields" });
    }

    // If no missing required fields then create the user
    // NOTE: I didn't add email as a required field here because its not required by the schema definition
    let ev;
    if(!edit){
      const event = new Event({fullName, phoneNumber, eventType, eventDate, renderedServices, totalCost, date, username, email});
      await event.save();
      ev = event
    }else{
      await Event.updateOne({ _id}, {fullName, phoneNumber, eventType, eventDate, renderedServices, totalCost, email})
    }
    res.status(201).json({ message: "Added event successfully", event: ev });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to add event", error: err.message });
  }
};

const seeEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.json({ events });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch events", error: err.message });
  }
};

const clearEvents = async (req, res) =>{
  try{
    await Event.deleteMany({})
    res.status(200).json({message:"Event's cleared"})
  }catch(e){
    res
      .status(500)
      .json({ message: "Failed to clear events", error: err.message });
  }
}
module.exports = { addEvent, seeEvents, clearEvents };
