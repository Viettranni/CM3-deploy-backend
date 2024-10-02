const Job = require("../models/jobModel");

// Controller functions for ReactJob go here
// Implement functions like get, add, delete, update

const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find();
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Server error: Unable to fetch jobs" });
  }
};

const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: "Server error: Unable to fetch job" });
  }
};

const addJob = async (req, res) => {
  const { title, type, location, description, salary, company, postedDate, status  } = req.body;

  if (!title || !type || !description|| !location  || !salary || !company || !postedDate || !status ) {
    return res.status(400).json({ message: "Please fill all fields" });
  }

  try {
    const newJob = new Job({
      title,
      type,
      description,
      company,
      location,
      salary,
      postedDate,      
      status,
    });

    const createdJob = await newJob.save();
    res.status(201).json(createdJob);
  } catch (error) {
    res.status(500).json({ message: "Server error: Unable to create job" });
  }
};

const updateJob = async (req, res) => {
  const { title, type, location, description, salary, company, postedDate, status } = req.body;

  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Update fields
    job.title = title || job.title;
    job.type = type || job.type;
    job.description = description || job.description;
    job.location = location || job.location;
    job.salary = salary || job.salary;
    job.company = company || job.company;
    job.postedDate = postedDate || job.postedDate;
    job.status = status || job.status;

    const updatedJob = await job.save();
    res.status(200).json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: "Server error: Unable to update job" });
  }
};

const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id); // Correct the model usage here

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    await Job.findByIdAndDelete(req.params.id); // Delete the job
    res.status(200).json({ message: "Job removed successfully" });
  } catch (error) {
    console.error("Error deleting job:", error); // Log the error for debugging
    res.status(500).json({ message: "Server error: Unable to delete job" });
  }
};

module.exports = {
  getAllJobs,
  getJobById,
  addJob,
  updateJob,
  deleteJob,
};
