document.addEventListener('DOMContentLoaded', function() {
    loadEventReportEntries();  // Load stored report entries on page load

    // Clear All button functionality
    document.getElementById('clearAllBtn').addEventListener('click', function() {
        if (confirm('Are you sure you want to clear all event entries?')) {
            localStorage.removeItem('eventReportEntries');
            localStorage.removeItem('eventEntries');  // Clear both pages' data
            loadEventReportEntries();
            updateEventCount();  // Reset the event count
        }
    });
});

// Load event report entries from localStorage
function loadEventReportEntries() {
    const eventReportEntries = JSON.parse(localStorage.getItem('eventReportEntries')) || [];
    const tableBody = document.querySelector('#eventReportTable tbody');
    tableBody.innerHTML = '';  // Clear previous entries

    if (eventReportEntries.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="8" style="text-align: center;">No entries available</td></tr>`;
    }

    eventReportEntries.forEach((entry) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${entry.fullName}</td>
            <td>${entry.phoneNo}</td>
            <td>${entry.email || 'N/A'}</td>
            <td>${entry.eventType}</td>
            <td>${entry.eventDate}</td>
            <td>${entry.services.join('<br>')}</td>
            <td>${entry.totalCost}</td>
            <td>${entry.date}</td>
        `;
        tableBody.appendChild(row);
    });

    // Update the event count when a new entry is loaded
    updateEventCount();
}

// Function to update the event count
function updateEventCount() {
    const eventReportEntries = JSON.parse(localStorage.getItem('eventReportEntries')) || [];
    const eventCount = eventReportEntries.length;

    // Save the event count in localStorage so it can be used in index.html
    localStorage.setItem('eventCount', eventCount);

    // Update the event count in the index.html if the page is loaded
    const statsElement = document.getElementById('event');
    if (statsElement) {
        statsElement.textContent = eventCount;
    }
}
