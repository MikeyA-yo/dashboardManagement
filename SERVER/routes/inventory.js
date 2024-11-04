const router = require("express").Router();
const {
  addTotalSales,
  addDailyStorageEntry,
  deleteAllDailyStorageEntries,
  addStorageUsageEntry,
  deleteAllStorageUsageEntries,
  seeDailyStorageEntries,
  seeStorageUsageEntries,
  seeTotalSales,
  deleteTotalSales,
} = require("../controllers/inventory");

// Route for the total sales
router
  .route("/totalSales")
  .post(addTotalSales)
  .get(seeTotalSales)
  .delete(deleteTotalSales);

// Route for the daily storage entry
router
  .route("/dailyStorageEntry")
  .post(addDailyStorageEntry)
  .delete(deleteAllDailyStorageEntries)
  .get(seeDailyStorageEntries);

// Route for the storage usage
router
  .route("/storageUsageEntry")
  .post(addStorageUsageEntry)
  .delete(deleteAllStorageUsageEntries)
  .get(seeStorageUsageEntries);

module.exports = router;
