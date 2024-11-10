// Global functions
let edit = false;
let currentUpdateId =""
// Load confirmed bookings from localStorage and display them
async function loadBookings() {
    const res1 = await fetch("/api/v1/bookings")
    const completedBookings = await res1.json() || [];
    const bookings = completedBookings.filter( b => b.isConfirmed)
    const confirmedBookingsDiv = document.getElementById('confirmed-bookings');
    confirmedBookingsDiv.innerHTML = '';

    const currentDate = new Date();

    bookings.forEach((booking, index) => {
        const bookingInfo = document.createElement('div');
        const expiryDate = new Date(booking.durationOfStayEnd);

        // Set expiry time to 12 PM (noon) on the dateTo
        expiryDate.setHours(12, 0, 0, 0);

        // Check if the current date is after 12 PM on the booking end date
        const isExpired = currentDate >= expiryDate;

        bookingInfo.innerHTML = `
            <table>
                <tr>
                    <th>Full Name</th>
                    <th>Phone</th>
                    <th>Duration</th>
                    <th>Room No</th>
                    <th>Room Price</th>
                    <th>Room Type</th>
                    <th>Number of Days</th>
                    <th>Total Amount</th>
                    <th>Actions</th>
                </tr>
                <tr>
                    <td>${booking.fullName}</td>
                    <td>${booking.phoneNumber}</td>
                    <td>${booking.durationOfStayStart.slice(0, booking.durationOfStayStart.indexOf("T"))} to ${booking.durationOfStayEnd.slice(0, booking.durationOfStayEnd.indexOf("T"))}</td>
                    <td>${booking.roomNumber}</td>
                    <td>${booking.roomPrice}</td>
                    <td>${booking.roomType}</td>
                    <td>${booking.numberOfDays}</td>
                    <td>${booking.totalAmount}</td>
                    <td>
                        <button class="action-button" onclick="editBooking(${index})">Edit</button>
                        <button class="action-button" onclick="printBooking(${index})">Print</button>
                        <button class="action-button" onclick="checkoutBooking(${index})">Check Out</button>
                    </td>
                </tr>
            </table>
        `;

        // Append expiration message if the booking has expired
        if (isExpired) {
            const expiryMessage = document.createElement('div');
            expiryMessage.innerHTML = '<span style="color: red; margin-left: 10px; font-weight: bold;">Room booking has expired.</span>';
            bookingInfo.appendChild(expiryMessage);
        }

        confirmedBookingsDiv.appendChild(bookingInfo);
    });
}

// Parse room info from the room listing page (room type, room no, price)
function parseRoomInfo(roomInfo) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(roomInfo, 'text/html');
    const roomNo = doc.querySelector('div:nth-child(2)').innerText;
    const price = doc.querySelector('div:nth-child(3)').innerText.split(': ')[1];
    const type = doc.querySelector('div:nth-child(1)').innerText;
    return { roomNo, price, type };
}

// Book Now functionality
async function bookNow() {
    const fullname = document.getElementById('fullname').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const dateFrom = document.getElementById('date-from').value;
    const dateTo = document.getElementById('date-to').value;
    const roomNo = document.getElementById('room-no').value.trim();
    let roomPrice = document.getElementById('room-price').value.trim();
    const roomType = document.getElementById('room-type').value.trim();

    if (!fullname || !phone || !dateFrom || !dateTo || !roomNo || !roomPrice || !roomType) {
        return;
    }

    // Remove any non-numeric characters except for the dot
    roomPrice = roomPrice.replace(/[^0-9.]/g, '');  // Clean the price input
    const roomPriceNum = parseFloat(roomPrice); // Parse the price into a number

    if (isNaN(roomPriceNum)) {
        alert('Invalid room price.');
        return;
    }

    const dateFromObj = new Date(dateFrom);
    const dateToObj = new Date(dateTo);

    const timeDiff = dateToObj - dateFromObj;
    const numberOfDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    if (numberOfDays <= 0) {
        alert('Check-out date must be after check-in date.');
        return;
    }

    const totalAmount = roomPriceNum * numberOfDays;

    const newBooking = {
        fullName:fullname,
        phoneNumber:phone,
        durationOfStayStart:dateFrom,
        durationOfStayEnd:dateTo,
        roomNumber:roomNo,
        roomPrice: parseInt(roomPriceNum.toFixed(2)),
        roomType,
        numberOfDays,
        username: JSON.parse(localStorage.getItem("user")).username,
        totalAmount: parseInt(totalAmount.toFixed(2))
    };
    
    const res1 = await fetch("/api/v1/bookings")
    const completedBookings = await res1.json() || [];
    const bookings = completedBookings.filter(b => b.isConfirmed)

    // Check if the room has already been booked
    const roomExists = bookings.some(booking => booking.roomNo === roomNo);
    if (!roomExists) {
        newBooking.isConfirmed = true
        if (edit){
            newBooking.edit = edit
            newBooking._id = currentUpdateId
            edit = false 
        }
        
        
        bookings.push(newBooking);
        try{
            const re = await fetch("/api/v1/bookings", {
                method:"POST",
                headers:{
                    "Content-type":"application/json"
                },
                body:JSON.stringify(newBooking)
            })
        }catch(e){
            console.log(e.message)
        }
       // localStorage.setItem('confirmedBookings', JSON.stringify(bookings));
        loadBookings();
        window.location.reload()
        document.getElementById('booking-form').reset();
    } else {
        alert('This room has already been booked. Please select a different room.');
    }
}

// Clear room fields
function clearRoomFields() {
    document.getElementById('room-no').value = '';
    document.getElementById('room-price').value = '';
    document.getElementById('room-type').value = '';
} 

// Edit booking functionality
 async function editBooking(index) {
    const res1 = await fetch("/api/v1/bookings")
    const completedBookings = await res1.json() || [];
    const bookings = completedBookings
    const booking = bookings[index];

    document.getElementById('fullname').value = booking.fullName;
    document.getElementById('phone').value = booking.phoneNumber;
    document.getElementById('date-from').value = booking.durationOfStayStart.slice(0, booking.durationOfStayStart.indexOf("T"));
    document.getElementById('date-to').value = booking.durationOfStayEnd.slice(0, booking.durationOfStayEnd.indexOf("T"));
    document.getElementById('room-no').value = booking.roomNumber;
    document.getElementById('room-price').value = booking.roomPrice;
    document.getElementById('room-type').value = booking.roomType;
    let roomNumber = booking.roomNumber
    let username = JSON.parse(localStorage.getItem("user")).username
    edit = true
    currentUpdateId = booking._id
    loadBookings();
}

// Populate the booking form with URL parameters
function getQueryParams() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
        roomType: urlParams.get('roomType'),
        roomNo: urlParams.get('roomNo'),
        roomPrice: urlParams.get('roomPrice')
    };
}

function populateBookingForm() {
    const { roomType, roomNo, roomPrice } = getQueryParams();
    if (roomType && roomNo && roomPrice) {
        document.getElementById('room-type').value = roomType;
        document.getElementById('room-no').value = roomNo;
        document.getElementById('room-price').value = roomPrice;
    }
}

// Run the function when the page loads
window.onload = function () {
    populateBookingForm();
    loadBookings();
};

// Print booking details
async function printBooking(index) {
    const res1 = await fetch("/api/v1/bookings")
    const completedBookings = await res1.json() || [];
    const bookings = completedBookings;
    const booking = bookings[index];
    const printWindow = window.open('', '', 'width=800,height=600');

    printWindow.document.write(`
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 20px;
            }
            h1, h2 {
                text-align: left;
            }
            p {
                font-weight: bold;
                text-align: left;
            }
            button {
                margin-top: 20px;
            }
        </style>
        <h1>Montevar Hotel</h1>
        <h2>Booking Receipt</h2>
        <p>Full Name: ${booking.fullName}</p>
        <p>Phone: ${booking.phoneNumber}</p>
        <p>Duration: ${booking.durationOfStayStart.slice(0, booking.durationOfStayStart.indexOf("T"))} to ${booking.durationOfStayEnd.slice(0, booking.durationOfStayEnd.indexOf("T"))}</p>
        <p>Room No: ${booking.roomNumber}</p>
        <p>Room Price: ${booking.roomPrice}</p>
        <p>Room Type: ${booking.roomType}</p>
        <p>Number of Days: ${booking.numberOfDays}</p>
        <p>Total Amount: ${booking.totalAmount}</p>
        <button onclick="window.print()">Print</button>
        <button onclick="window.close()">Close</button>
    `);
}

// Checkout booking and remove from the confirmed bookings
// Checkout function
async function checkoutBooking(index) {
    const res1 = await fetch("/api/v1/bookings")
    const completedBookings = await res1.json() || [];
    const bookings = completedBookings;
    const booking = bookings[index];

    // Create checkout data object
    const checkoutData = {
        fullName: booking.fullName,
        phoneNumber: booking.phoneNumber,
        roomNumber: booking.roomNumber,
        roomPrice: booking.roomPrice,
        roomType: booking.roomType,
        durationOfStayStart: booking.durationOfStayStart,
        durationOfStayEnd: booking.durationOfStayEnd,
        numberOfDays: booking.numberOfDays,
        username: JSON.parse(localStorage.getItem("user")).username,
        totalAmount: booking.totalAmount,
        completedDate: new Date().toISOString()  // Add completed date 
    };

    //remove from confirmed
    let roomNumber = booking.roomNumber
    let username = JSON.parse(localStorage.getItem("user")).username
    //

    // Add the checkout data to completedBookings
    completedBookings.push(checkoutData);
    checkoutData.isConfirmed = false
    checkoutData.edit = true;
    checkoutData._id = bookings[index]._id
    const res = await fetch("/api/v1/bookings", {
        method:"POST",
        headers:{
            "Content-type":"application/json"
        },
        body:JSON.stringify(checkoutData)
    })
    window.location.reload()
    //localStorage.setItem('completedBookings', JSON.stringify(completedBookings));


    // Update the booking count
    // updateBookingCount(); undefined

    // Remove the booking from the DOM immediately (without page reload)
    const bookingItem = document.querySelector(`#confirmed-booking-${index}`);  // Dynamically get the booking item by its unique ID
    if (bookingItem) {
        bookingItem.remove();  // Remove the checked-out booking item from the DOM
    }

    // Update the booking report
    //loadBookingReport();
}


// Export checkout booking to booking_report.js
function exportCheckoutToReport(bookingDetails) {
    let bookingReports = JSON.parse(localStorage.getItem('bookingReports')) || [];
    bookingReports.push(bookingDetails);
    localStorage.setItem('bookingReports', JSON.stringify(bookingReports));
}
