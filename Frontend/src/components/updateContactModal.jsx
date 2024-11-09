/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import axios from "axios";

const UpdateContactModal = ({ onClose, onUpdateContact, contactData }) => {
  const [updatedContactData, setUpdatedContactData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
  });
    const [ error, setError ] = useState("");
    

  // Populate form with existing contact data when modal opens
  useEffect(() => {
    if (contactData) {
      setUpdatedContactData(contactData);
    }
  }, [contactData]);

  const handleChange = (e) => {
    setUpdatedContactData({
      ...updatedContactData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${import.meta.env.VITE_APP_BACKEND_URL}/contacts/${contactData._id}`,
        updatedContactData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onUpdateContact(response.data); // Update contacts list in Home component
      onClose(); // Close the modal
    } catch (err) {
      setError("Failed to update contact.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Update Contact</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={updatedContactData.firstName}
            onChange={handleChange}
            className="w-full mb-2 p-2 border rounded"
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={updatedContactData.lastName}
            onChange={handleChange}
            className="w-full mb-2 p-2 border rounded"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={updatedContactData.email}
            onChange={handleChange}
            className="w-full mb-2 p-2 border rounded"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone"
            value={updatedContactData.phone}
            onChange={handleChange}
            className="w-full mb-2 p-2 border rounded"
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={updatedContactData.address}
            onChange={handleChange}
            className="w-full mb-4 p-2 border rounded"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
          >
            Update Contact
          </button>
          <button
            onClick={onClose}
            type="button"
            className="text-gray-600 px-4 py-2 rounded"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateContactModal;
