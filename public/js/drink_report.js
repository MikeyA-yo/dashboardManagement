document.addEventListener('DOMContentLoaded', function() {
    loadDrinkReportEntries();  // Load drink entries when the page loads

    // Clear All button functionality
    document.getElementById('clearAllBtn').addEventListener('click', async function() {
        if (confirm('Are you sure you want to clear all drink entries?')) {
            // Clear entries in localStorage
            localStorage.removeItem('drinkEntries');
            loadDrinkReportEntries();  // Refresh the table after clearing entries
            updateDrinkCount();  // Reset the drink count
        }
    });
});

// Load drink report entries from localStorage and display them in the table
function loadDrinkReportEntries() {
    const drinkReportEntries = JSON.parse(localStorage.getItem('drinkEntries')) || [];
    const tableBody = document.querySelector('#drinkReportTable tbody');
    tableBody.innerHTML = '';  // Clear previous entries

    if (drinkReportEntries.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center;">No entries available</td></tr>`;
    }

    drinkReportEntries.forEach((entry) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${entry.roomNumber}</td>
            <td>${entry.drinkType}</td>
            <td>${entry.beverageType}</td>
            <td>${entry.paymentMethod}</td>
            <td>${entry.serviceLocation}</td>
            <td>${entry.totalAmount}</td>
            <td>${entry.date}</td>
        `;
        tableBody.appendChild(row);
    });

    // Update the drink count when a new entry is loaded
    updateDrinkCount();
}

// Function to update the drink count
function updateDrinkCount() {
    const drinkReportEntries = JSON.parse(localStorage.getItem('drinkEntries')) || [];
    const drinkCount = drinkReportEntries.length;

    // Save the drink count in localStorage so it can be used in index.html
    localStorage.setItem('drinkCount', drinkCount);

    // Update the drink count in the index.html if the page is loaded
    const statsElement = document.getElementById('drink-count');
    if (statsElement) {
        statsElement.textContent = drinkCount;
    }
}
