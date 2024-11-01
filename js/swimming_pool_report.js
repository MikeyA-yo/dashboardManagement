document.addEventListener('DOMContentLoaded', function() {
    loadSwimmingPoolReportEntries();  // Load stored report entries on page load

    // Clear All button functionality
    document.getElementById('clearAllBtn').addEventListener('click', function() {
        if (confirm('Are you sure you want to clear all swimming pool entries?')) {
            localStorage.removeItem('swimmingPoolEntries'); // Clear the entries
            loadSwimmingPoolReportEntries(); // Reload the table after clearing
            updateSwimmingPoolCount();  // Reset the pool count
        }
    });
});

// Load swimming pool report entries from localStorage and display them in the table
function loadSwimmingPoolReportEntries() {
    const swimmingPoolEntries = JSON.parse(localStorage.getItem('swimmingPoolEntries')) || [];
    const tableBody = document.querySelector('#swimmingPoolReportTable tbody');
    tableBody.innerHTML = '';  // Clear previous entries

    if (swimmingPoolEntries.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5" style="text-align: center;">No entries available</td></tr>`;
    }

    swimmingPoolEntries.forEach((entry) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${entry.fullName}</td>
            <td>${entry.hours} Hour(s)</td>
            <td>${entry.accessories.join('<br>')}</td>
            <td>${entry.totalCost}</td>
            <td>${entry.date}</td>
        `;
        tableBody.appendChild(row);
    });

    // Update the pool count when a new entry is loaded
    updateSwimmingPoolCount();
}

// Function to update the swimming pool count
function updateSwimmingPoolCount() {
    const swimmingPoolEntries = JSON.parse(localStorage.getItem('swimmingPoolEntries')) || [];
    const poolCount = swimmingPoolEntries.length;

    // Save the pool count in localStorage so it can be used in index.html
    localStorage.setItem('poolCount', poolCount);

    // Update the pool count in the index.html if the page is loaded
    const statsElement = document.getElementById('pool-count');
    if (statsElement) {
        statsElement.textContent = poolCount;
    }
}
