document.addEventListener('DOMContentLoaded', function() {
    loadLaundryReportEntries();  // Load stored report entries on page load

    // Clear All button functionality
    document.getElementById('clearAllBtn').addEventListener('click', function() {
        if (confirm('Are you sure you want to clear all laundry entries?')) {
            localStorage.removeItem('laundryReportEntries');
            localStorage.removeItem('laundryEntries');  // Clear both pages' data
            loadLaundryReportEntries();
            updateLaundryCount();  // Reset the laundry count
        }
    });
});

// Load laundry report entries from localStorage
function loadLaundryReportEntries() {
    const laundryReportEntries = JSON.parse(localStorage.getItem('laundryReportEntries')) || [];
    const tableBody = document.querySelector('#laundryReportTable tbody');
    tableBody.innerHTML = '';  // Clear previous entries

    if (laundryReportEntries.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center;">No entries available</td></tr>`;
    }

    laundryReportEntries.forEach((entry) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${entry.fullName}</td>
            <td>${entry.roomNo}</td>
            <td>${entry.totalClothes}</td>
            <td>${entry.serviceType.join('<br>')}</td>
            <td>${entry.paymentMethod}</td>
            <td>${entry.totalAmount}</td>
            <td>${entry.date}</td>
        `;
        tableBody.appendChild(row);
    });

    // Update the laundry count when a new entry is loaded
    updateLaundryCount();
}

// Function to update the laundry count
function updateLaundryCount() {
    const laundryReportEntries = JSON.parse(localStorage.getItem('laundryReportEntries')) || [];
    const laundryCount = laundryReportEntries.length;

    // Save the laundry count in localStorage so it can be used in index.html
    localStorage.setItem('laundryCount', laundryCount);

    // Update the laundry count in the index.html if the page is loaded
    const statsElement = document.getElementById('laundry-count');
    if (statsElement) {
        statsElement.textContent = laundryCount;
    }
}
