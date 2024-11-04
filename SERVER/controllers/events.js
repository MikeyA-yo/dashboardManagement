const Event = require("../models/Event");

const addEvent = async (req, res) => {
  try {
    // regular checks for required fields
    const requiredFields = [
      "fullName",
      "phoneNumber",
      "eventType",
      "eventDate",
      "renderedServices",
      "totalCost",
    ];

    const missingField = requiredFields.some((field) => !req.body[field]);
    if (missingField) {
      return res
        .status(400)
        .json({ message: "Please fill all necessary fields" });
    }

    // If no missing required fields then create the user
    // NOTE: I didn't add email as a required field here because its not required by the schema definition
    const event = Event.create({ ...req.body });
    res.status(201).json({ message: "Added event successfully", event: event });
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

module.exports = { addEvent, seeEvents };
