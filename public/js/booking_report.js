document.addEventListener("DOMContentLoaded", function() {
    loadBookingReport();
    updateBookingCount();  // Ensure count is updated when the page loads
});

// Load completed bookings from localStorage and display them in the booking report, showing the date only once per day
async function loadBookingReport() {
    const res1 = await fetch("/api/v1/bookings")
    let bks = await res1.json() || [];
    const completedBookings = bks.filter(booking => !booking.isConfirmed);
    const bookingReportDiv = document.getElementById('booking-report');
    bookingReportDiv.innerHTML = ''; // Clear the report section first

    // If no completed bookings, display a message
    if (completedBookings.length === 0) {
        bookingReportDiv.innerHTML = '<p>No completed bookings available.</p>';
        return;
    }

    let lastDisplayedDate = ''; // To keep track of the last displayed date
 
    completedBookings.forEach(booking => {
        // Ensure completedDate exists and is in a valid format
        let bookingDate = booking.completedDate ? new Date(booking.completedDate) : null;

        // If completedDate is not valid, set it to the current date
        if (!bookingDate || isNaN(bookingDate.getTime())) {
            bookingDate = new Date(); // Default to current date if the completedDate is invalid or missing
        }

        const formattedBookingDate = bookingDate.toLocaleDateString(); // Format the booking date

        // Only display the date if it's different from the last displayed date
        if (formattedBookingDate !== lastDisplayedDate) {
            const dateHeader = document.createElement('h2');
            dateHeader.textContent = `Bookings for ${formattedBookingDate}`;
            dateHeader.classList.add('date-header'); // Add the new class for styling
            bookingReportDiv.appendChild(dateHeader);
            lastDisplayedDate = formattedBookingDate; // Update the last displayed date
        }

        // Create and append the booking entry
        const bookingInfo = document.createElement('div');
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
                </tr>
            </table>
        `;
        bookingReportDiv.appendChild(bookingInfo);
    });

    // Update the booking count after loading the report
    updateBookingCount();
}

// Function to update the booking count in the dashboard card
async function updateBookingCount() {
    const res1 = await fetch("/api/v1/bookings")
    let bks = await res1.json() || [];
    const completedBookings = bks.filter(booking => !booking.isConfirmed);
    const bookingCount = completedBookings.length;

    // Update the booking count in the UI (card in the dashboard)
    const bookingCard = document.getElementById('bookings');
    const statsElement = document.querySelector('.stats');
    if (statsElement) {
        statsElement.textContent = bookingCount;
    }
}

// Function to clear completed bookings from localStorage (only for this report)
async function clearBookings() {
    if (confirm('Are you sure you want to clear all completed bookings from this report?')) {

        //do this:
        const re = await fetch("/api/v1/bookings", {
            method:"DELETE",
            headers:{
                "Content-type":"application/json"
            },
            body:JSON.stringify({completed:true})
        })
        // Clear the completed bookings from localStorage (affects only the booking report)
        //localStorage.removeItem('completedBookings');

        // After clearing, update the report section to reflect the change
        const bookingReportDiv = document.getElementById('booking-report');
        bookingReportDiv.innerHTML = '<p>No completed bookings available.</p>';
        
        // Reset booking count after clearing bookings
        updateBookingCount();
    }
}

// Simulate adding a new completed booking for testing
async function addBooking() {
    const res1 = await fetch("/api/v1/bookings")
    const completedBookings = await res1.json() || [];
     

  
    completedBookings.push(newBooking); // Add to completed bookings
    const res = await fetch("/api/v1/bookings", {
        method:"POST",
        headers:{
            "Content-type":"application/json"
        },
        body:JSON.stringify(completedBookings)
    })
    // Save back to localStorage
    //localStorage.setItem('completedBookings', JSON.stringify(completedBookings));

    // Reload the bookings on the page
    loadBookingReport();

    // Update the booking count
    updateBookingCount();
}
