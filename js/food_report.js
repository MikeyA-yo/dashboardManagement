document.addEventListener('DOMContentLoaded', function() {
    loadFoodReportEntries();  // Load food entries from localStorage when the page is loaded

    // Clear All button functionality
    document.getElementById('clearAllBtn').addEventListener('click', function() {
        if (confirm('Are you sure you want to clear all entries?')) {
            // Clear food entries from both food_report.html and room_food.html
            localStorage.removeItem('foodReportEntries');
            localStorage.removeItem('foodEntries');  // Clear room_food.html entries as well

            loadFoodReportEntries();  // Refresh the table after clearing entries
            updateFoodCount();  // Reset the food count
        }
    });
});

// Load food report entries from localStorage and display them in the table
function loadFoodReportEntries() {
    const foodReportEntries = JSON.parse(localStorage.getItem('foodReportEntries')) || [];
    const tableBody = document.querySelector('#foodReportTable tbody');
    tableBody.innerHTML = '';  // Clear previous entries

    if (foodReportEntries.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center;">No entries available</td></tr>`;
    }

    foodReportEntries.forEach((entry) => {
        // Ensure foodType and beverage are arrays (fallback to arrays if not)
        const foodType = Array.isArray(entry.foodType) ? entry.foodType : [entry.foodType];
        const beverage = Array.isArray(entry.beverage) ? entry.beverage : [entry.beverage];

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${entry.roomNo}</td>
            <td>${foodType.join('<br>')}</td>
            <td>${beverage.join('<br>')}</td>
            <td>${entry.paymentMethod}</td>
            <td>${entry.serviceLocation}</td>
            <td>${entry.totalAmount}</td>
            <td>${entry.date}</td>
        `;
        tableBody.appendChild(row);
    });

    // Update the food count when a new entry is loaded
    updateFoodCount();
}

// Function to update the food count
function updateFoodCount() {
    const foodReportEntries = JSON.parse(localStorage.getItem('foodReportEntries')) || [];
    const foodCount = foodReportEntries.length;

    // Save the food count in localStorage so it can be used in index.html
    localStorage.setItem('foodCount', foodCount);

    // Update the food count in the index.html if the page is loaded
    const statsElement = document.getElementById('food-count');
    if (statsElement) {
        statsElement.textContent = foodCount;
    }
}
