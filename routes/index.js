var express = require('express');
const db = require("../config/db");
var router = express.Router();


// Display All Staff (GET /)
router.get("/", (req, res) => {
  const query = `SELECT 
                  indexNumber, 
                  fullNames, 
                  email, 
                  currentLocation, 
                  highestLevelOfEducation, 
                  dutyStation 
                FROM staffdetails`;

  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.send("Database error occurred.");
    }
    // Render 'index.ejs' with staff data
    res.render("index", { staffList: results });
  });
});

// 3. Show Form to Add New Staff (GET /add)
router.get("/add", (req, res) => {
  res.render("form", { staff: {}, action: "/add", buttonText: "Add Staff" });
});

// Handle Form Submission to Add New Staff (POST /add)
router.post("/add", (req, res) => {
  const {
    fullNames,
    email,
    currentLocation,
    highestLevelOfEducation,
    dutyStation,
    availabilityForRemoteWork,
    softwareExpertise,
    softwareExpertiseLevel,
    language,
    levelOfResponsibility
  } = req.body;

  const query = `INSERT INTO staffdetails SET ?`;
  const data = {
    fullNames,
    email,
    currentLocation,
    highestLevelOfEducation,
    dutyStation,
    availabilityForRemoteWork: availabilityForRemoteWork ? 1 : 0,
    softwareExpertise,
    softwareExpertiseLevel,
    language,
    levelOfResponsibility
  };

  db.query(query, data, (err, result) => {
    if (err) {
      console.error(err);
      return res.send("Error inserting staff record.");
    }
    res.redirect("/");
  });
});

router.get("/view/:indexNumber", (req, res) => {
  const { indexNumber } = req.params;
  const query = "SELECT * FROM staffdetails WHERE indexNumber = ?";

  db.query(query, [indexNumber], (err, results) => {
    if (err) {
      console.error(err);
      return res.send("Error retrieving staff record.");
    }
    if (results.length === 0) {
      return res.send("Staff not found.");
    }
    // Render a new template, passing the staff data
    res.render("view", { staff: results[0] });
  });
});

// Show Form to Edit Existing Staff (GET /edit/:indexNumber)
router.get("/edit/:indexNumber", (req, res) => {
  const { indexNumber } = req.params;
  const query = `SELECT * FROM staffdetails WHERE indexNumber = ?`;

  db.query(query, [indexNumber], (err, results) => {
    if (err) {
      console.error(err);
      return res.send("Error retrieving staff record.");
    }
    if (results.length === 0) {
      return res.send("Staff not found.");
    }
    // Render the same form but pre-fill data for editing
    res.render("form", {
      staff: results[0],
      action: `/edit/${indexNumber}`,
      buttonText: "Update Staff"
    });
  });
});

//  Handle Form Submission to Update Staff (POST /edit/:indexNumber)
router.post("/edit/:indexNumber", (req, res) => {
  const { indexNumber } = req.params;
  const {
    fullNames,
    email,
    currentLocation,
    highestLevelOfEducation,
    dutyStation,
    availabilityForRemoteWork,
    softwareExpertise,
    softwareExpertiseLevel,
    language,
    levelOfResponsibility
  } = req.body;

  const query = `UPDATE staffdetails SET ? WHERE indexNumber = ?`;
  const data = {
    fullNames,
    email,
    currentLocation,
    highestLevelOfEducation,
    dutyStation,
    availabilityForRemoteWork: availabilityForRemoteWork ? 1 : 0,
    softwareExpertise,
    softwareExpertiseLevel,
    language,
    levelOfResponsibility
  };

  db.query(query, [data, indexNumber], (err, result) => {
    if (err) {
      console.error(err);
      return res.send("Error updating staff record.");
    }
    res.redirect("/");
  });
});

// Delete Staff (GET /delete/:indexNumber)
router.get("/delete/:indexNumber", (req, res) => {
  const { indexNumber } = req.params;
  const query = `DELETE FROM staffdetails WHERE indexNumber = ?`;

  db.query(query, [indexNumber], (err, result) => {
    if (err) {
      console.error(err);
      return res.send("Error deleting staff record.");
    }
    res.redirect("/");
  });
});

module.exports = router;
