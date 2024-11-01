// Global functions

// Load confirmed bookings from localStorage and display them
function loadBookings() {
    const bookings = JSON.parse(localStorage.getItem('confirmedBookings')) || [];
    const confirmedBookingsDiv = document.getElementById('confirmed-bookings');
    confirmedBookingsDiv.innerHTML = '';

    const currentDate = new Date();

    bookings.forEach((booking, index) => {
        const bookingInfo = document.createElement('div');
        const expiryDate = new Date(booking.dateTo);

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
                    <td>${booking.fullname}</td>
                    <td>${booking.phone}</td>
                    <td>${booking.dateFrom} to ${booking.dateTo}</td>
                    <td>${booking.roomNo}</td>
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
function bookNow() {
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
        fullname,
        phone,
        dateFrom,
        dateTo,
        roomNo,
        roomPrice: roomPriceNum.toFixed(2),
        roomType,
        numberOfDays,
        totalAmount: totalAmount.toFixed(2)
    };

    const bookings = JSON.parse(localStorage.getItem('confirmedBookings')) || [];

    // Check if the room has already been booked
    const roomExists = bookings.some(booking => booking.roomNo === roomNo);
    if (!roomExists) {
        bookings.push(newBooking);
        localStorage.setItem('confirmedBookings', JSON.stringify(bookings));
        loadBookings();
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
function editBooking(index) {
    const bookings = JSON.parse(localStorage.getItem('confirmedBookings'));
    const booking = bookings[index];

    document.getElementById('fullname').value = booking.fullname;
    document.getElementById('phone').value = booking.phone;
    document.getElementById('date-from').value = booking.dateFrom;
    document.getElementById('date-to').value = booking.dateTo;
    document.getElementById('room-no').value = booking.roomNo;
    document.getElementById('room-price').value = booking.roomPrice;
    document.getElementById('room-type').value = booking.roomType;

    bookings.splice(index, 1);
    localStorage.setItem('confirmedBookings', JSON.stringify(bookings));
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
function printBooking(index) {
    const bookings = JSON.parse(localStorage.getItem('confirmedBookings'));
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
        <p>Full Name: ${booking.fullname}</p>
        <p>Phone: ${booking.phone}</p>
        <p>Duration: ${booking.dateFrom} to ${booking.dateTo}</p>
        <p>Room No: ${booking.roomNo}</p>
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
function checkoutBooking(index) {
    const bookings = JSON.parse(localStorage.getItem('confirmedBookings'));
    const booking = bookings[index];

    // Create checkout data object
    const checkoutData = {
        fullname: booking.fullname,
        phone: booking.phone,
        roomNo: booking.roomNo,
        roomPrice: booking.roomPrice,
        roomType: booking.roomType,
        dateFrom: booking.dateFrom,
        dateTo: booking.dateTo,
        numberOfDays: booking.numberOfDays,
        totalAmount: booking.totalAmount,
        completedDate: new Date().toISOString()  // Add completed date
    };

    // Add the checkout data to completedBookings
    const completedBookings = JSON.parse(localStorage.getItem('completedBookings')) || [];
    completedBookings.push(checkoutData);
    localStorage.setItem('completedBookings', JSON.stringify(completedBookings));

    // Remove the booking from confirmedBookings
    bookings.splice(index, 1);
    localStorage.setItem('confirmedBookings', JSON.stringify(bookings));

    // Update the booking count
    updateBookingCount();

    // Remove the booking from the DOM immediately (without page reload)
    const bookingItem = document.querySelector(`#confirmed-booking-${index}`);  // Dynamically get the booking item by its unique ID
    if (bookingItem) {
        bookingItem.remove();  // Remove the checked-out booking item from the DOM
    }

    // Update the booking report
    loadBookingReport();
}


// Export checkout booking to booking_report.js
function exportCheckoutToReport(bookingDetails) {
    let bookingReports = JSON.parse(localStorage.getItem('bookingReports')) || [];
    bookingReports.push(bookingDetails);
    localStorage.setItem('bookingReports', JSON.stringify(bookingReports));
}
