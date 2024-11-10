document.addEventListener('DOMContentLoaded', function() {
    loadFoodReportEntries();  // Load food entries from localStorage when the page is loaded

    // Clear All button functionality
    document.getElementById('clearAllBtn').addEventListener('click',async function() {
        if (confirm('Are you sure you want to clear all entries?')) {

            await fetch("/api/v1/food", {
                method:"DELETE"
            })
            // Clear food entries from both food_report.html and room_food.html
            // localStorage.removeItem('foodReportEntries');
            // localStorage.removeItem('foodEntries');  // Clear room_food.html entries as well

            loadFoodReportEntries();  // Refresh the table after clearing entries
            updateFoodCount();  // Reset the food count
        }
    });
});

// Load food report entries from localStorage and display them in the table
async function loadFoodReportEntries() {
    const res = await fetch("api/v1/food");
    const jsondata = await res.json()
    const foodEntries = jsondata.foods || [];
    const foodReportEntries = foodEntries || [];
    const tableBody = document.querySelector('#foodReportTable tbody');
    tableBody.innerHTML = '';  // Clear previous entries

    if (foodReportEntries.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center;">No entries available</td></tr>`;
    }

    foodReportEntries.forEach((entry) => {
        // Ensure foodType and beverage are arrays (fallback to arrays if not)
        //this messes up the db if it's an array
        const foodType =  entry.typeOfFood
        const beverage =  entry.beverageOrWater

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${entry.roomNumber}</td>
            <td>${foodType}</td>
            <td>${beverage}</td>
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
async function updateFoodCount() {
    const res = await fetch("api/v1/food");
    const jsondata = await res.json()
    const foodEntries = jsondata.foods || [];
    const foodReportEntries = foodEntries || [];
    const foodCount = foodReportEntries.length;

    // Save the food count in localStorage so it can be used in index.html
    localStorage.setItem('foodCount', foodCount);

    // Update the food count in the index.html if the page is loaded
    const statsElement = document.getElementById('food-count');
    if (statsElement) {
        statsElement.textContent = foodCount;
    }
}
