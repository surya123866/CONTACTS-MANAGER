const Contact = require("../models/contact");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

// Create a new contact
const createContact = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { firstName, lastName, email, phone, address } = req.body;

  try {
    // Check for an existing contact with the same email for this user
    const existingContact = await Contact.findOne({
      email,
      userId: req.userId,
    });
    if (existingContact) {
      return res
        .status(409)
        .json({ message: "Contact with this email already exists" });
    }

    const newContact = new Contact({
      firstName,
      lastName,
      email,
      phone,
      address,
      userId: req.userId, // Associate contact with authenticated user
    });

    await newContact.save();
    res.status(201).json(newContact);
  } catch (error) {
    console.error("Error creating contact:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all contacts for the authenticated user
const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({ userId: req.userId });
    res.status(200).json(contacts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get a single contact by ID
const getContactById = async (req, res) => {
  const { id } = req.params;

  // Check if the id is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid contact ID" });
  }

  try {
    const contact = await Contact.findOne({ _id: id, userId: req.userId });
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.status(200).json(contact);
  } catch (error) {
    console.error("Error fetching contact by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update a contact
const updateContact = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, phone, address } = req.body;

  // Check if the id is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid contact ID" });
  }

  // Validate request data
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Dynamically build the update object to avoid updating with undefined values
  const updateData = {};
  if (firstName) updateData.firstName = firstName;
  if (lastName) updateData.lastName = lastName;
  if (email) updateData.email = email;
  if (phone) updateData.phone = phone;
  if (address) updateData.address = address;

  try {
    const contact = await Contact.findOneAndUpdate(
      { _id: id, userId: req.userId },
      updateData,
      { new: true } // Return the updated contact
    );

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.status(200).json(contact);
  } catch (error) {
    console.error("Error updating contact:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a contact

const deleteContact = async (req, res) => {
  const { id } = req.params;

  // Check if the id is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid contact ID" });
  }

  try {
    const contact = await Contact.findOneAndDelete({
      _id: id,
      userId: req.userId,
    });

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.status(200).json({ message: "Contact successfully deleted" });
  } catch (error) {
    console.error("Error deleting contact:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Merge duplicate contacts
const mergeContacts = async (req, res) => {
  const { contactIds } = req.body;

  // Ensure we have at least two contact IDs
  if (!Array.isArray(contactIds) || contactIds.length < 2) {
    return res.status(400).json({ message: "Provide at least two contact IDs to merge." });
  }

  // Validate all IDs before proceeding
  if (!contactIds.every((id) => mongoose.Types.ObjectId.isValid(id))) {
    return res.status(400).json({ message: "One or more contact IDs are invalid." });
  }

  try {
    const contacts = await Contact.find({
      _id: { $in: contactIds },
      userId: req.userId,
    });

    // Ensure at least two valid contacts exist for the user
    if (contacts.length < 2) {
      return res.status(404).json({ message: "At least two contacts must exist for merging." });
    }

    // Merge contact fields, prioritizing the first contact's non-empty fields
    const mergedContact = contacts.reduce((acc, contact) => {
      acc.firstName = acc.firstName || contact.firstName;
      acc.lastName = acc.lastName || contact.lastName;
      acc.email = acc.email || contact.email;
      acc.phone = acc.phone || contact.phone;
      acc.address = acc.address || contact.address;
      return acc;
    }, {});

    // Start a session to ensure transactional safety
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Delete original contacts
      await Contact.deleteMany({ _id: { $in: contactIds }, userId: req.userId }).session(session);

      // Create a new contact with merged information
      const newContact = new Contact({
        ...mergedContact,
        userId: req.userId,
      });
      await newContact.save({ session });

      // Commit the transaction
      await session.commitTransaction();
      session.endSession();

      res.status(201).json(newContact);
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error("Error during merge transaction:", error);
      res.status(500).json({ message: "Failed to merge contacts" });
    }
  } catch (error) {
    console.error("Error merging contacts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createContact,
  getContacts,
  getContactById,
  updateContact,
  deleteContact,
  mergeContacts,
};
