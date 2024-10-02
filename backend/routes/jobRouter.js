const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const {
  getAllJobs,
  getJobById,
  addJob,
  updateJob,
  deleteJob,
} = require("../controllers/jobController");

const router = express.Router();

// Define routes for reactJob
router.get("/", getAllJobs);

router.get("/:id", getJobById);

// require auth for editing purpose
router.use(requireAuth);

router.post("/", addJob);

router.put("/:id", updateJob);

router.delete("/:id", deleteJob);

// Export the router
module.exports = router;
