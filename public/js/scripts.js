$('#menu-icon').click(function() {
    $('#menu').toggleClass("active");
})










function checkLogin() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (loggedInUser) {
        document.getElementById('welcomeName').textContent = loggedInUser.name;
    } else {
        // If not logged in, redirect to login page
        window.location.href = 'login.html';
    }
}

// Disable back button navigation after login
function disableBackNavigation() {
    window.history.pushState(null, '', window.location.href);
    window.onpopstate = function () {
        window.history.pushState(null, '', window.location.href);
    };
}
async function init(){
    document.getElementById("welcomeName").textContent = JSON.parse(localStorage.getItem("user")).name
   // bookings handler
   const res1 = await fetch("/api/v1/bookings")
    const completedBookings = await res1.json() || [];
    document.getElementById("booking-count").textContent = completedBookings.length
    // drinks handler
    const res2 = await fetch("/api/v1/drinks");
    const drinks = await res2.json()
    const drinkEntries = drinks.drinks || [];
    document.getElementById("drink-count").textContent = drinkEntries.length
    //food handler
    const res3 = await fetch("api/v1/food");
    const jsondata = await res3.json()
    const foodEntries = jsondata.foods || [];
    document.getElementById("food-count").textContent = foodEntries.length
    //event handler
    const res4 = await fetch("/api/v1/events");
    const jsonData = await res4.json()
    const eventEntries = jsonData.events || [];
    document.getElementById("event").textContent = eventEntries.length
    // laundry handler
    const res5 = await fetch("/api/v1/laundry");
    const data =await res5.json()
    const laundryEntries = data || [];
    document.getElementById("laundry-count").textContent = laundryEntries.length
    // pool handler
    const res6 = await fetch("/api/v1/pools")
    const dataP = await res6.json()
    const swimmingPoolEntries = dataP || [];
    document.getElementById("pool-count").textContent = swimmingPoolEntries.length;
}
// Logout function
async function logout() {
    localStorage.clear();
    await fetch("api/v1/users/logout", {
        method:"POST",
        credentials:"include",
        headers:{
            "Content-type":"application/json"
        }
    })
    window.location.href = 'login.html';
}

// Initialize functions
checkLogin();
disableBackNavigation();
init()












let targetPage = '';

// Function to open the modal
function openModal(page) {
    targetPage = page;  // Store the page to redirect after login
    document.getElementById('loginModal').style.display = 'block';
}

// Function to close the modal
function closeModal() {
    document.getElementById('loginModal').style.display = 'none';
}

// Function to validate the login and redirect if successful
async function validateLogin() {
    const modalUsername = document.getElementById('modalUsername').value;
    const modalPassword = document.getElementById('modalPassword').value;

    // Retrieve the stored login credentials
    const storedUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const res = await fetch("/api/v1/users/login", {
        method: "POST",
        credentials:"include",
        headers:{
            "Content-type":"application/json"
        },
        body: JSON.stringify({username:modalUsername, password:modalPassword})
    })
    if(res.ok){
        closeModal();  // Close the modal
        window.location.href = targetPage;  // Redirect to the target page
    }else{
        alert('Invalid credentials! Please try again.');
    }
    // if (storedUser && modalUsername === storedUser.username && modalPassword === storedUser.password) {
    //     closeModal();  // Close the modal
    //     window.location.href = targetPage;  // Redirect to the target page
    // } else {
    //     alert('Invalid credentials! Please try again.');
    // }
}

// Close the modal if the user clicks outside of it
window.onclick = function(event) {
    const modal = document.getElementById('loginModal');
    if (event.target == modal) {
        closeModal();
    }
}


























function addBooking() {
    // Functionality to add a booking
    // alert('Add Booking');
}

function viewDetails(section) {
    // Functionality to view details for a section
    // alert(`View Details for ${section}`);
}

function addRoomFood() {
    // Functionality to add room food order
    // alert('Add Room Food');
}





document.addEventListener("DOMContentLoaded", function() {
    updateBookingCount();  // Ensure count is updated when the page loads
});

// Function to update the booking count in the dashboard card
function updateBookingCount() {
    init()
    // const completedBookings = JSON.parse(localStorage.getItem('completedBookings')) || [];
    // const bookingCount = completedBookings.length;

    // // Update the booking count in the UI (card in the dashboard)
    // const statsElement = document.getElementById('booking-count');
    // if (statsElement) {
    //     statsElement.textContent = bookingCount;
    // }
}

// Simulate adding a new completed booking for testing
// function addBooking() {
//     // const completedBookings = JSON.parse(localStorage.getItem('completedBookings')) || [];
    
   

//     completedBookings.push(newBooking); // Add to completed bookings

//     // Save back to localStorage
//     localStorage.setItem('completedBookings', JSON.stringify(completedBookings));

//     // Update the booking count on the page after adding a new booking
//     updateBookingCount();
// }

// document.addEventListener('DOMContentLoaded', function() {
//     const foodCount = localStorage.getItem('foodCount') || 0;
//     document.getElementById('food-count').textContent = foodCount;
// });


// document.addEventListener('DOMContentLoaded', function() {
//     const drinkCount = localStorage.getItem('drinkCount') || 0;
//     document.getElementById('drink-count').textContent = drinkCount;
// });


// document.addEventListener('DOMContentLoaded', function() {
//     const eventCount = localStorage.getItem('eventCount') || 0;
//     document.getElementById('event').textContent = eventCount;
// });


// document.addEventListener('DOMContentLoaded', function() {
//     const laundryCount = localStorage.getItem('laundryCount') || 0;
//     document.getElementById('laundry-count').textContent = laundryCount;
// });


// document.addEventListener('DOMContentLoaded', function() {
//     const poolCount = localStorage.getItem('poolCount') || 0;
//     document.getElementById('pool-count').textContent = poolCount;
// });








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
                        <button class="icon" onclick="viewDetails(${index})">
                            <div> 
                                <div class="click"> Details </div> 
                                <div class="click-icon"> ℹ️ </div>
                            </div>
                        </button>
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




// Function to display the booking details as a modal popup
// Function to display the booking details as a modal popup
async function viewBookingDetails() {
    const res1 = await fetch("/api/v1/bookings")
    const completedBookings = await res1.json() || [];
    const bookings = completedBookings.filter(b => b.isConfirmed)
    const popup = document.getElementById('booking-details-popup');
    const contentDiv = document.getElementById('booking-details-content');
    contentDiv.innerHTML = '';  // Clear previous content

    const currentDate = new Date();

    // Create a table to hold the booking details
    const table = document.createElement('table');

    // Table headers
    const headerRow = `
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
    `;
    table.innerHTML = headerRow;

    bookings.forEach((booking, index) => {
        const expiryDate = new Date(booking.dateTo);
        // Set expiry time to 12 PM (noon) on the dateTo
        expiryDate.setHours(12, 0, 0, 0);

        // Check if the current date is after 12 PM on the booking end date
        const isExpired = currentDate >= expiryDate;

        // Create a row for each booking
        const bookingRow = `
            <tr>
                <td>${booking.fullName}</td>
                <td>${booking.phoneNumber}</td>
                <td>${booking.durationOfStayStart} to ${booking.durationOfStayEnd}</td>
                <td>${booking.roomNumber}</td>
                <td>${booking.roomPrice}</td>
                <td>${booking.roomType}</td>
                <td>${booking.numberOfDays}</td>
                <td>${booking.totalAmount}</td>
                <td>
                    <button class="action-button" onclick="printBooking(${index})">Print</button>
                    <button class="action-button" onclick="checkoutBooking(${index})">Check Out</button>
                </td>
            </tr>
        `;
        table.innerHTML += bookingRow;

        // Append expiration message if the booking has expired
        if (isExpired) {
            const expiryMessage = `<div><span style="color: red; font-weight: bold;">Room booking has expired.</span></div>`;
            table.innerHTML += expiryMessage;
        }
    });

    // Append the table to the scrollable container
    contentDiv.appendChild(table);

    // Display the popup
    popup.style.display = 'block';
}

// Function to close the popup
function closeBookingDetails() {
    const popup = document.getElementById('booking-details-popup');
    popup.style.display = 'none';
}

// Function to print booking details (for future logic)
function printBooking(index) {
    console.log("Printing booking at index:", index);
}

// Function to handle checkout action
function checkoutBooking(index) {
    const bookings = JSON.parse(localStorage.getItem('confirmedBookings')) || [];
    bookings.splice(index, 1); // Remove the booking from the array
    localStorage.setItem('confirmedBookings', JSON.stringify(bookings)); // Save the updated bookings
    viewBookingDetails(); // Reload the modal to reflect the changes
}




// Function to print booking details
// Print booking details with 80mm mini printer style
async function printBooking(index) {
    const res1 = await fetch("/api/v1/bookings")
    const completedBookings = await res1.json() || [];
    const bookings = completedBookings.filter(b => b.isConfirmed)
    const booking = bookings[index];
    const printWindow = window.open('', '', 'width=800,height=600');

    printWindow.document.write(`
        <html>
            <head>
                <title>Booking Receipt - Montevar Hotel</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        padding: 5px;
                        width: 80mm;
                        font-size: 10px;
                        color: #333;
                    }
                    h1 {
                        font-size: 14px;
                        margin-bottom: 5px;
                    }
                    h2 {
                        font-size: 12px;
                        margin-bottom: 10px;
                    }
                    .receipt-container {
                        width: 100%;
                        margin: 0 auto;
                        text-align: left;
                    }
                    .receipt-details p {
                        font-size: 10px;
                        margin: 3px 0;
                        line-height: 1.2;
                    }
                    .label {
                        font-weight: bold;
                    }
                    .actions {
                        margin-top: 10px;
                    }
                    .actions button {
                        padding: 5px 10px;
                        font-size: 10px;
                        margin: 2px;
                        cursor: pointer;
                        border: none;
                        background-color: #007BFF;
                        color: white;
                        border-radius: 3px;
                    }
                    .actions button:hover {
                        background-color: #0056b3;
                    }
                </style>
            </head>
            <body>
                <div class="receipt-container">
                    <h1>Montevar Hotel</h1>
                    <h2>Booking Receipt</h2>

                    <div class="receipt-details">
                        <p><span class="label">Full Name:</span> ${booking.fullName}</p>
                        <p><span class="label">Phone:</span> ${booking.phoneNumber}</p>
                        <p><span class="label">Duration:</span> ${booking.durationOfStayStart} to ${booking.durationOfStayEnd}</p>
                        <p><span class="label">Room No:</span> ${booking.roomNumber}</p>
                        <p><span class="label">Room Price:</span> ${booking.roomPrice}</p>
                        <p><span class="label">Room Type:</span> ${booking.roomType}</p>
                        <p><span class="label">Number of Days:</span> ${booking.numberOfDays}</p>
                        <p><span class="label">Total Amount:</span> ${booking.totalAmount}</p>
                    </div>

                    <div class="actions">
                        <button onclick="window.print()">Print</button>
                        <button onclick="window.close()">Close</button>
                    </div>
                </div>
            </body>
        </html>
    `);

    printWindow.document.close();  // Ensure the document is fully loaded before any actions
    printWindow.focus();           // Focus on the new window to ensure it opens
}







// Function to handle viewing details for room-food entries
function viewDetails(type) {
    if (type === 'room-food') {
        loadFoodEntries(); // Load and display food entries
        const popup = document.getElementById('food-details-popup'); // Assuming a similar popup container like booking-details
        popup.style.display = 'block'; // Show the popup
    }
}

// Load food entries from localStorage and display in a table
function loadFoodEntries() {
    const foodEntries = JSON.parse(localStorage.getItem('foodEntries')) || [];
    const contentDiv = document.getElementById('food-details-content'); // Assuming a content div inside popup
    contentDiv.innerHTML = '';  // Clear previous content

    // Create a table for displaying food entries
    const table = document.createElement('table');
    const headerRow = `
        <tr>
            <th>Room No</th>
            <th>Food Type</th>
            <th>Beverage</th>
            <th>Payment Method</th>
            <th>Service Location</th>
            <th>Total Amount</th>
            <th>Date</th>
            <th>Actions</th>
        </tr>
    `;
    table.innerHTML = headerRow;

    foodEntries.forEach((entry, index) => {
        const foodRow = `
            <tr>
                <td>${entry.roomNo}</td>
                <td>${entry.foodType.join('<br>')}</td>
                <td>${entry.beverage.join('<br>')}</td>
                <td>${entry.paymentMethod}</td>
                <td>${entry.serviceLocation}</td>
                <td>${entry.totalAmount}</td>
                <td>${entry.date}</td>
                <td>
                    <button class="action-button" onclick="printEntry(${index})">Print</button>
                </td>
            </tr>
        `;
        table.innerHTML += foodRow;
    });

    contentDiv.appendChild(table);
}

// Function to close the food details popup
function closeFoodDetails() {
    const popup = document.getElementById('food-details-popup');
    popup.style.display = 'none';
}

// Function to print room-food entry
function printEntry(index) {
    const foodEntries = JSON.parse(localStorage.getItem('foodEntries'));
    const entry = foodEntries[index];
    const printWindow = window.open('', '', 'width=800,height=600');

    printWindow.document.write(`
        <html>
            <head>
                <title>Food Service Receipt - Montevar Hotel</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        padding: 5px;
                        width: 80mm;
                        font-size: 10px;
                        color: #333;
                    }
                    h1 {
                        font-size: 14px;
                        margin-bottom: 5px;
                    }
                    h2 {
                        font-size: 12px;
                        margin-bottom: 10px;
                    }
                    .receipt-container {
                        width: 100%;
                        margin: 0 auto;
                        text-align: left;
                    }
                    .receipt-details p {
                        font-size: 10px;
                        margin: 3px 0;
                        line-height: 1.2;
                    }
                    .label {
                        font-weight: bold;
                    }
                    .actions {
                        margin-top: 10px;
                    }
                    .actions button {
                        padding: 5px 10px;
                        font-size: 10px;
                        margin: 2px;
                        cursor: pointer;
                        border: none;
                        background-color: #007BFF;
                        color: white;
                        border-radius: 3px;
                    }
                    .actions button:hover {
                        background-color: #0056b3;
                    }
                </style>
            </head>
            <body>
                <div class="receipt-container">
                    <h1>Montevar Hotel</h1>
                    <h2>Food Service Receipt</h2>

                    <div class="receipt-details">
                        <p><span class="label">Room No:</span> ${entry.roomNo}</p>
                        <p><span class="label">Food Type:</span> ${entry.foodType.join(', ')}</p>
                        <p><span class="label">Beverage:</span> ${entry.beverage.join(', ')}</p>
                        <p><span class="label">Payment Method:</span> ${entry.paymentMethod}</p>
                        <p><span class="label">Service Location:</span> ${entry.serviceLocation}</p>
                        <p><span class="label">Total Amount:</span> ${entry.totalAmount}</p>
                        <p><span class="label">Date:</span> ${entry.date}</p>
                    </div>

                    <div class="actions">
                        <button onclick="window.print()">Print</button>
                        <button onclick="window.close()">Close</button>
                    </div>
                </div>
            </body>
        </html>
    `);

    printWindow.document.close();
    printWindow.focus();
}







// Function to load and display the drink entries in a modal
async function viewDetails(type) {
    if (type === 'drinks') {
        const res = await fetch("/api/v1/drinks");
        const drinks = await res.json()
        const drinkEntries = drinks.drinks || []; 
        const popup = document.getElementById('drink-details-popup');
        const contentDiv = document.getElementById('drink-details-content');
        contentDiv.innerHTML = '';  // Clear previous content

        // Create a table to display drink details
        const table = document.createElement('table');
        const headerRow = `
            <tr>
                <th>Room No</th>
                <th>Drink Type</th>
                <th>Beverages</th>
                <th>Payment Method</th>
                <th>Service Location</th>
                <th>Total Amount</th>
                <th>Date</th>
                <th>Actions</th>
            </tr>
        `;
        table.innerHTML = headerRow;

        drinkEntries.forEach((entry, index) => {
            const drinkRow = `
                <tr>
                    <td>${entry.roomNumber}</td>
                    <td>${entry.drinkType}</td>
                    <td>${entry.beverageType}</td>
                    <td>${entry.paymentMethod}</td>
                    <td>${entry.serviceLocation}</td>
                    <td>${entry.totalAmount}</td>
                    <td>${entry.date}</td>
                    <td>
                        <button class="action-button" onclick="printDrinkEntry(${index})">Print</button>
                    </td>
                </tr>
            `;
            table.innerHTML += drinkRow;
        });

        contentDiv.appendChild(table);
        popup.style.display = 'block';
    }
}

// Function to close the drink details modal
function closeDrinkDetails() {
    const popup = document.getElementById('drink-details-popup');
    popup.style.display = 'none';
}

// Function to print drink entry details
function printDrinkEntry(index) {
    const drinkEntries = JSON.parse(localStorage.getItem('drinkEntries'));
    const entry = drinkEntries[index];
    const printWindow = window.open('', '', 'width=800,height=600');

    printWindow.document.write(`
        <html>
            <head>
                <title>Drink Receipt - Montevar Hotel</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        padding: 5px;
                        width: 80mm;
                        font-size: 10px;
                        color: #333;
                    }
                    h1 {
                        font-size: 14px;
                        margin-bottom: 5px;
                    }
                    h2 {
                        font-size: 12px;
                        margin-bottom: 10px;
                    }
                    .receipt-container {
                        width: 100%;
                        margin: 0 auto;
                        text-align: left;
                    }
                    .receipt-details p {
                        font-size: 10px;
                        margin: 3px 0;
                        line-height: 1.2;
                    }
                    .label {
                        font-weight: bold;
                    }
                    .actions {
                        margin-top: 10px;
                    }
                    .actions button {
                        padding: 5px 10px;
                        font-size: 10px;
                        margin: 2px;
                        cursor: pointer;
                        border: none;
                        background-color: #007BFF;
                        color: white;
                        border-radius: 3px;
                    }
                    .actions button:hover {
                        background-color: #0056b3;
                    }
                </style>
            </head>
            <body>
                <div class="receipt-container">
                    <h1>Montevar Hotel</h1>
                    <h2>Drink Receipt</h2>

                    <div class="receipt-details">
                        <p><span class="label">Room No:</span> ${entry.roomNo}</p>
                        <p><span class="label">Drink Type:</span> ${entry.drinkType.join(', ')}</p>
                        <p><span class="label">Beverages:</span> ${entry.beverage.join(', ')}</p>
                        <p><span class="label">Payment Method:</span> ${entry.paymentMethod}</p>
                        <p><span class="label">Service Location:</span> ${entry.serviceLocation}</p>
                        <p><span class="label">Total Amount:</span> ${entry.totalAmount}</p>
                        <p><span class="label">Date:</span> ${entry.date}</p>
                    </div>

                    <div class="actions">
                        <button onclick="window.print()">Print</button>
                        <button onclick="window.close()">Close</button>
                    </div>
                </div>
            </body>
        </html>
    `);

    printWindow.document.close(); // Ensure the document is fully loaded before any actions
    printWindow.focus(); // Focus on the new window to ensure it opens
}




// Function to load and display the event entries in a modal
function viewDetails(type) {
    if (type === 'events') {
        const eventEntries = JSON.parse(localStorage.getItem('eventEntries')) || [];
        const popup = document.getElementById('event-details-popup');
        const contentDiv = document.getElementById('event-details-content');
        contentDiv.innerHTML = '';  // Clear previous content

        // Create a table to display event details
        const table = document.createElement('table');
        const headerRow = `
            <tr>
                <th>Full Name</th>
                <th>Phone No</th>
                <th>Email</th>
                <th>Event Type</th>
                <th>Event Date</th>
                <th>Services</th>
                <th>Total Cost</th>
                <th>Date</th>
                <th>Actions</th>
            </tr>
        `;
        table.innerHTML = headerRow;

        eventEntries.forEach((entry, index) => {
            const eventRow = `
                <tr>
                    <td>${entry.fullName}</td>
                    <td>${entry.phoneNo}</td>
                    <td>${entry.email || 'N/A'}</td>
                    <td>${entry.eventType}</td>
                    <td>${entry.eventDate}</td>
                    <td>${entry.services.join('<br>')}</td>
                    <td>${entry.totalCost}</td>
                    <td>${entry.date}</td>
                    <td>
                        <button class="action-button" onclick="printEventEntry(${index})">Print</button>
                    </td>
                </tr>
            `;
            table.innerHTML += eventRow;
        });

        contentDiv.appendChild(table);
        popup.style.display = 'block';
    }
}

// Function to close the event details modal
function closeEventDetails() {
    const popup = document.getElementById('event-details-popup');
    popup.style.display = 'none';
}

// Function to print event entry details
function printEventEntry(index) {
    const eventEntries = JSON.parse(localStorage.getItem('eventEntries'));
    const entry = eventEntries[index];
    const printWindow = window.open('', '', 'width=800,height=600');

    printWindow.document.write(`
        <html>
            <head>
                <title>Event Receipt - Montevar Hotel</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        padding: 5px;
                        width: 80mm;
                        font-size: 10px;
                        color: #333;
                    }
                    h1 {
                        font-size: 14px;
                        margin-bottom: 5px;
                    }
                    h2 {
                        font-size: 12px;
                        margin-bottom: 10px;
                    }
                    .receipt-container {
                        width: 100%;
                        margin: 0 auto;
                        text-align: left;
                    }
                    .receipt-details p {
                        font-size: 10px;
                        margin: 3px 0;
                        line-height: 1.2;
                    }
                    .label {
                        font-weight: bold;
                    }
                    .actions {
                        margin-top: 10px;
                    }
                    .actions button {
                        padding: 5px 10px;
                        font-size: 10px;
                        margin: 2px;
                        cursor: pointer;
                        border: none;
                        background-color: #007BFF;
                        color: white;
                        border-radius: 3px;
                    }
                    .actions button:hover {
                        background-color: #0056b3;
                    }
                </style>
            </head>
            <body>
                <div class="receipt-container">
                    <h1>Montevar Hotel</h1>
                    <h2>Event Receipt</h2>

                    <div class="receipt-details">
                        <p><span class="label">Full Name:</span> ${entry.fullName}</p>
                        <p><span class="label">Phone No:</span> ${entry.phoneNo}</p>
                        <p><span class="label">Email:</span> ${entry.email || 'N/A'}</p>
                        <p><span class="label">Event Type:</span> ${entry.eventType}</p>
                        <p><span class="label">Event Date:</span> ${entry.eventDate}</p>
                        <p><span class="label">Services:</span> ${entry.services.join(', ')}</p>
                        <p><span class="label">Total Cost:</span> ${entry.totalCost}</p>
                        <p><span class="label">Date:</span> ${entry.date}</p>
                    </div>

                    <div class="actions">
                        <button onclick="window.print()">Print</button>
                        <button onclick="window.close()">Close</button>
                    </div>
                </div>
            </body>
        </html>
    `);

    printWindow.document.close(); // Ensure the document is fully loaded before any actions
    printWindow.focus(); // Focus on the new window to ensure it opens
}



// Function to load and display the laundry entries in a modal
function viewDetails(type) {
    if (type === 'laundry') {
        const laundryEntries = JSON.parse(localStorage.getItem('laundryEntries')) || [];
        const popup = document.getElementById('laundry-details-popup');
        const contentDiv = document.getElementById('laundry-details-content');
        contentDiv.innerHTML = '';  // Clear previous content

        // Create a table to display laundry details
        const table = document.createElement('table');
        const headerRow = `
            <tr>
                <th>Full Name</th>
                <th>Room No</th>
                <th>Total Clothes</th>
                <th>Service Type</th>
                <th>Payment Method</th>
                <th>Total Amount</th>
                <th>Date</th>
                <th>Actions</th>
            </tr>
        `;
        table.innerHTML = headerRow;

        laundryEntries.forEach((entry, index) => {
            const laundryRow = `
                <tr>
                    <td>${entry.fullName}</td>
                    <td>${entry.roomNo}</td>
                    <td>${entry.totalClothes}</td>
                    <td>${entry.serviceType.join('<br>')}</td>
                    <td>${entry.paymentMethod}</td>
                    <td>${entry.totalAmount}</td>
                    <td>${entry.date}</td>
                    <td>
                        <button class="action-button" onclick="printLaundryEntry(${index})">Print</button>
                    </td>
                </tr>
            `;
            table.innerHTML += laundryRow;
        });

        contentDiv.appendChild(table);
        popup.style.display = 'block';
    }
}

// Function to close the laundry details modal
function closeLaundryDetails() {
    const popup = document.getElementById('laundry-details-popup');
    popup.style.display = 'none';
}

// Function to print laundry entry details
function printLaundryEntry(index) {
    const laundryEntries = JSON.parse(localStorage.getItem('laundryEntries'));
    const entry = laundryEntries[index];
    const printWindow = window.open('', '', 'width=800,height=600');

    printWindow.document.write(`
        <html>
            <head>
                <title>Laundry Receipt - Montevar Hotel</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        padding: 5px;
                        width: 80mm;
                        font-size: 10px;
                        color: #333;
                    }
                    h1 {
                        font-size: 14px;
                        margin-bottom: 5px;
                    }
                    h2 {
                        font-size: 12px;
                        margin-bottom: 10px;
                    }
                    .receipt-container {
                        width: 100%;
                        margin: 0 auto;
                        text-align: left;
                    }
                    .receipt-details p {
                        font-size: 10px;
                        margin: 3px 0;
                        line-height: 1.2;
                    }
                    .label {
                        font-weight: bold;
                    }
                    .actions {
                        margin-top: 10px;
                    }
                    .actions button {
                        padding: 5px 10px;
                        font-size: 10px;
                        margin: 2px;
                        cursor: pointer;
                        border: none;
                        background-color: #007BFF;
                        color: white;
                        border-radius: 3px;
                    }
                    .actions button:hover {
                        background-color: #0056b3;
                    }
                </style>
            </head>
            <body>
                <div class="receipt-container">
                    <h1>Montevar Hotel</h1>
                    <h2>Laundry Receipt</h2>

                    <div class="receipt-details">
                        <p><span class="label">Full Name:</span> ${entry.fullName}</p>
                        <p><span class="label">Room No:</span> ${entry.roomNo}</p>
                        <p><span class="label">Total Clothes:</span> ${entry.totalClothes}</p>
                        <p><span class="label">Service Type:</span> ${entry.serviceType.join(', ')}</p>
                        <p><span class="label">Payment Method:</span> ${entry.paymentMethod}</p>
                        <p><span class="label">Total Amount:</span> ${entry.totalAmount}</p>
                        <p><span class="label">Date:</span> ${entry.date}</p>
                    </div>

                    <div class="actions">
                        <button onclick="window.print()">Print</button>
                        <button onclick="window.close()">Close</button>
                    </div>
                </div>
            </body>
        </html>
    `);

    printWindow.document.close(); // Ensure the document is fully loaded before any actions
    printWindow.focus(); // Focus on the new window to ensure it opens
}




// Function to load and display the swimming pool entries in a modal
async function viewDetails(type) {
    if (type === 'pool') {
        const res = await fetch("/api/v1/pools")
        const data = await res.json()
        const swimmingPoolEntries = data || [];
        const popup = document.getElementById('pool-details-popup');
        const contentDiv = document.getElementById('pool-details-content');
        contentDiv.innerHTML = '';  // Clear previous content

        // Create a table to display swimming pool details
        const table = document.createElement('table');
        const headerRow = `
            <tr>
                <th>Full Name</th>
                <th>Hours</th>
                <th>Accessories</th>
                <th>Total Cost</th>
                <th>Actions</th>
            </tr>
        `;
        table.innerHTML = headerRow;

        swimmingPoolEntries.forEach((entry, index) => {
            const poolRow = `
                <tr>
                    <td>${entry.fullName}</td>
                    <td>${entry.hours} Hour(s)</td>
                    <td>${entry.hotelAccessories}</td>
                    <td>${entry.totalCost}</td>
                    <td>
                        <button class="action-button" onclick="printSwimmingPoolEntry(${index})">Print</button>
                    </td>
                </tr>
            `;
            table.innerHTML += poolRow;
        });

        contentDiv.appendChild(table);
        popup.style.display = 'block';
    }
}

// Function to close the swimming pool details modal
function closePoolDetails() {
    const popup = document.getElementById('pool-details-popup');
    popup.style.display = 'none';
}

// Function to print swimming pool entry details
async function printSwimmingPoolEntry(index) {
    const res = await fetch("/api/v1/pools")
    const data = await res.json()
    const swimmingPoolEntries = data || [];
    const entry = swimmingPoolEntries[index];
    const printWindow = window.open('', '', 'width=800,height=600');

    printWindow.document.write(`
        <html>
            <head>
                <title>Swimming Pool Receipt - Montevar Hotel</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        padding: 5px;
                        width: 80mm;
                        font-size: 10px;
                        color: #333;
                    }
                    h1 {
                        font-size: 14px;
                        margin-bottom: 5px;
                    }
                    h2 {
                        font-size: 12px;
                        margin-bottom: 10px;
                    }
                    .receipt-container {
                        width: 100%;
                        margin: 0 auto;
                        text-align: left;
                    }
                    .receipt-details p {
                        font-size: 10px;
                        margin: 3px 0;
                        line-height: 1.2;
                    }
                    .label {
                        font-weight: bold;
                    }
                    .actions {
                        margin-top: 10px;
                    }
                    .actions button {
                        padding: 5px 10px;
                        font-size: 10px;
                        margin: 2px;
                        cursor: pointer;
                        border: none;
                        background-color: #007BFF;
                        color: white;
                        border-radius: 3px;
                    }
                    .actions button:hover {
                        background-color: #0056b3;
                    }
                </style>
            </head>
            <body>
                <div class="receipt-container">
                    <h1>Montevar Hotel</h1>
                    <h2>Swimming Pool Receipt</h2>

                    <div class="receipt-details">
                        <p><span class="label">Full Name:</span> ${entry.fullName}</p>
                        <p><span class="label">Hours:</span> ${entry.hours} Hour(s)</p>
                        <p><span class="label">Accessories:</span> ${entry.hotelAccessories}</p>
                        <p><span class="label">Total Cost:</span> ${entry.totalCost}</p>
                    </div>

                    <div class="actions">
                        <button onclick="window.print()">Print</button>
                        <button onclick="window.close()">Close</button>
                    </div>
                </div>
            </body>
        </html>
    `);

    printWindow.document.close(); // Ensure the document is fully loaded before any actions
    printWindow.focus(); // Focus on the new window to ensure it opens
}
