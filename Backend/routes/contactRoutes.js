// routes/contactRoutes.js
const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactsController");
const { check } = require("express-validator");
const { isAuthenticated } = require("../middleware/authMiddleware");

// Apply the authentication middleware to all contact routes
router.use(isAuthenticated);

// Create a new contact
router.post(
  "/create/contact",
  [
    check("firstName").not().isEmpty().withMessage("First name is required"),
    check("lastName").not().isEmpty().withMessage("Last name is required"),
    check("email").isEmail().withMessage("Email is invalid"),
    check("phone")
      .optional()
      .isMobilePhone()
      .withMessage("Phone number is invalid"),
    check("address")
      .optional()
      .not()
      .isEmpty()
      .withMessage("Address cannot be empty if provided"),
  ],
  contactController.createContact
);

// Get all contacts
router.get("/contacts", contactController.getContacts);

// Get a single contact by ID
router.get("/contacts/:id", contactController.getContactById);

// Update a contact
router.put(
  "/contacts/:id",
  [
    check("firstName").not().isEmpty().withMessage("First name is required"),
    check("lastName").not().isEmpty().withMessage("Last name is required"),
    check("email").isEmail().withMessage("Email is invalid"),
    check("phone")
      .optional()
      .isMobilePhone()
      .withMessage("Phone number is invalid"),
    check("address")
      .optional()
      .not()
      .isEmpty()
      .withMessage("Address cannot be empty if provided"),
  ],
  contactController.updateContact
);

// Delete a contact
router.delete("/contacts/:id", contactController.deleteContact);

// Merge duplicate contacts
router.post("/contacts/merge", contactController.mergeContacts);

module.exports = router;
