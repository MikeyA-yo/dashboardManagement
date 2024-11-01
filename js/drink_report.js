document.addEventListener('DOMContentLoaded', function() {
    loadDrinkReportEntries();  // Load drink entries when the page loads

    // Clear All button functionality
    document.getElementById('clearAllBtn').addEventListener('click', function() {
        if (confirm('Are you sure you want to clear all drink entries?')) {
            // Clear both the drink report entries and the drink entries on the drink page
            localStorage.removeItem('drinkReportEntries');
            localStorage.removeItem('drinkEntries');  // This clears the drink entries on both pages

            loadDrinkReportEntries();  // Refresh the table after clearing entries
            updateDrinkCount();  // Reset the drink count
        }
    });
});

// Load drink report entries from localStorage and display them in the table
function loadDrinkReportEntries() {
    const drinkReportEntries = JSON.parse(localStorage.getItem('drinkReportEntries')) || [];
    const tableBody = document.querySelector('#drinkReportTable tbody');
    tableBody.innerHTML = '';  // Clear previous entries

    if (drinkReportEntries.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center;">No entries available</td></tr>`;
    }

    drinkReportEntries.forEach((entry) => {
        // Ensure drinkType and beverage are arrays (fallback to arrays if not)
        const drinkType = Array.isArray(entry.drinkType) ? entry.drinkType : [entry.drinkType];
        const beverage = Array.isArray(entry.beverage) ? entry.beverage : [entry.beverage];

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${entry.roomNo}</td>
            <td>${drinkType.join('<br>')}</td>
            <td>${beverage.join('<br>')}</td>
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
    const drinkReportEntries = JSON.parse(localStorage.getItem('drinkReportEntries')) || [];
    const drinkCount = drinkReportEntries.length;

    // Save the drink count in localStorage so it can be used in index.html
    localStorage.setItem('drinkCount', drinkCount);

    // Update the drink count in the index.html if the page is loaded
    const statsElement = document.getElementById('drink-count');
    if (statsElement) {
        statsElement.textContent = drinkCount;
    }
}
