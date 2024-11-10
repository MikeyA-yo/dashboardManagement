document.addEventListener('DOMContentLoaded', function() {
    loadSwimmingPoolReportEntries();  // Load stored report entries on page load

    // Clear All button functionality
    document.getElementById('clearAllBtn').addEventListener('click',async function() {
        if (confirm('Are you sure you want to clear all swimming pool entries?')) {
            await fetch("/api/v1/pools", {
              method:"DELETE"
            })
            // localStorage.removeItem('swimmingPoolEntries'); // Clear the entries
            loadSwimmingPoolReportEntries(); // Reload the table after clearing
            updateSwimmingPoolCount();  // Reset the pool count
        }
    });
});

// Load swimming pool report entries from localStorage and display them in the table
async function loadSwimmingPoolReportEntries() {
    const res = await fetch("/api/v1/pools")
    const data = await res.json()
    const swimmingPoolEntries = data || [];
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
            <td>${entry.hotelAccessories}</td>
            <td>${entry.totalCost}</td>
            <td>${entry.date}</td>
        `;
        tableBody.appendChild(row);
    });

    // Update the pool count when a new entry is loaded
    updateSwimmingPoolCount();
}

// Function to update the swimming pool count
async function updateSwimmingPoolCount() {
    const res = await fetch("/api/v1/pools")
    const data = await res.json()
    const swimmingPoolEntries = data || [];
    const poolCount = swimmingPoolEntries.length;

    // Save the pool count in localStorage so it can be used in index.html
    localStorage.setItem('poolCount', poolCount);

    // Update the pool count in the index.html if the page is loaded
    const statsElement = document.getElementById('pool-count');
    if (statsElement) {
        statsElement.textContent = poolCount;
    }
}
