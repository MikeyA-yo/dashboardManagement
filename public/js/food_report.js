document.addEventListener("DOMContentLoaded", function () {
    const foodReportTableBody = document.querySelector("#foodReportTable tbody");

    // Load saved food entries from localStorage
    function loadFoodReportEntries() {
        const foodReportEntries = JSON.parse(localStorage.getItem("foodReportEntries")) || [];
        foodReportEntries.forEach((entry) => {
            addFoodReportEntryToTable(entry);
        });
    }

    // Add entry to the food report table
    function addFoodReportEntryToTable(entry) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${entry.roomNo}</td>
            <td>
                ${entry.foodTypes.map((type, index) => {
                    return `<div class="food-item-entry">
                                <span>${type}</span> - <span>${entry.foodAmounts[index]}</span>
                            </div>`;
                }).join("")}
            </td>
            <td>${entry.paymentMethod}</td>
            <td>${entry.serviceLocation}</td>
            <td>${entry.totalAmount}</td>
            <td>${entry.dateOfEntry}</td>
        `;
        foodReportTableBody.appendChild(row);
    }

    // Clear all entries
    const clearAllBtn = document.getElementById("clearAllBtn");
    clearAllBtn.addEventListener("click", function () {
        localStorage.removeItem("foodReportEntries");
        foodReportTableBody.innerHTML = ""; // Clear the table as well
    });

    // Load entries on page load
    loadFoodReportEntries();
});
