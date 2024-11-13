const Booking = require("../models/Booking");

// Adding a new booking
const addBooking = async (req, res) => {
  try {
    const requiredFields = [
      "fullName",
      "durationOfStayStart",
      "durationOfStayEnd",
      "roomNumber",
      "roomPrice",
      "roomType",
      "phoneNumber",
    ];
    // const hasMissingField = requiredFields.some((field) => !req.body[field]);

    // if (hasMissingField) {
    //   //\To check for missing fields
    //   return res
    //     .status(400)
    //     .json({ message: "Please fill all necessary fields" });
    // }
    let {
      fullName,
      phoneNumber,
      durationOfStayStart,
      durationOfStayEnd,
      roomNumber,
      roomPrice,
      roomType,
      numberOfDays,
      totalAmount,
      username,
      isConfirmed,
      edit,
      _id,
      isPrint
    } = req.body;
    if( edit && isPrint && _id && (
      !fullName ||
      !phoneNumber ||
      !durationOfStayStart ||
      !durationOfStayEnd ||
      !roomNumber ||
      !roomPrice ||
      !roomType
    )){
      let b = await Booking.updateOne({_id}, {isPrint});
      return res.status(200).json({message:b})
    }
    if (
      !fullName ||
      !phoneNumber ||
      !durationOfStayStart ||
      !durationOfStayEnd ||
      !roomNumber ||
      !roomPrice ||
      !roomType
    ) {
      return res
        .status(400)
        .json({ message: "Please fill all necessary fields" });
    }
    let bk
    if (!edit){
      const booking = new Booking({
        fullName,
        phoneNumber,
        durationOfStayStart,
        durationOfStayEnd,
        roomNumber,
        roomPrice,
        roomType,
        numberOfDays,
        totalAmount,
        username,
        isConfirmed,
      });
      booking.save();
      bk = booking
    }else{
      bk = await Booking.updateOne({_id}, {fullName,
        phoneNumber,
        durationOfStayStart,
        durationOfStayEnd,
        roomNumber,
        roomPrice,
        roomType,
        numberOfDays,
        totalAmount,
        isConfirmed})

    }
    res.status(201).json({ message: "Booking successfully added", bk });
  } catch (err) {
    res 
      .status(500)
      .json({ message: "Failed to add booking", error: err.message });
  }
};

const seeBookings = async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json(bookings);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch bookings", error: err.message });
  }
};
const deleteBookings = async (req, res) => {
  const {  roomNumber, completed } = req.body;
  try {
    const bookings =  Booking.find();
    
    if (roomNumber){
      await bookings.deleteMany({ roomNumber})
    } else if (completed){
      await bookings.deleteMany({ isConfirmed:false})
    }else{
      await bookings.deleteMany({})
    }
  } catch (e) {
    res
      .status(500)
      .json({ message: "Failed to delete bookings", error: err.message });
  }
};
module.exports = { addBooking, seeBookings, deleteBookings };
