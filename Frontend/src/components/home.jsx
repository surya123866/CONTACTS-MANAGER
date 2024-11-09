/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AddContactModal from "./addContactModal";
import UpdateContactModal from "./updateContactModal";

const Home = () => {
  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState("");
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [isAddContactModalOpen, setIsAddContactModalOpen] = useState(false);
  const [isUpdateContactModalOpen, setIsUpdateContactModalOpen] =
    useState(false);
  const [contactToUpdate, setContactToUpdate] = useState(null);
  const navigate = useNavigate();

  const fetchContacts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_APP_BACKEND_URL}/contacts`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setContacts(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "An error occurred while fetching contacts."
      );
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_APP_BACKEND_URL}/contacts/${id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setContacts(contacts.filter((contact) => contact._id !== id));
    } catch (err) {
      setError("Failed to delete contact.");
    }
  };

  const handleSelect = (id) => {
    setSelectedContacts((prev) =>
      prev.includes(id)
        ? prev.filter((contactId) => contactId !== id)
        : [...prev, id]
    );
  };

  const handleMerge = async () => {
    if (selectedContacts.length < 2) {
      setError("Select at least two contacts to merge.");
      return;
    }
    try {
      await axios.post(
        `${import.meta.env.VITE_APP_BACKEND_URL}/contacts/merge`,
        { contactIds: selectedContacts },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setSelectedContacts([]);
      fetchContacts();
    } catch (err) {
      setError("Failed to merge contacts.");
    }
  };

  const handleAddContact = (newContact) => {
    setContacts((prevContacts) => [...prevContacts, newContact]);
  };

  const handleUpdateContact = (updatedContact) => {
    setContacts((prevContacts) =>
      prevContacts.map((contact) =>
        contact._id === updatedContact._id ? updatedContact : contact
      )
    );
  };

  const openUpdateModal = (contact) => {
    setContactToUpdate(contact); // Set the selected contact data
    setIsUpdateContactModalOpen(true); // Open the modal
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Contacts</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded shadow-md min-w-[600px]">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="py-2 px-4">Select</th>
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Email</th>
              <th className="py-2 px-4">Phone</th>
              <th className="py-2 px-4">Address</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr key={contact._id} className="border-b">
                <td className="py-2 px-4">
                  <input
                    type="checkbox"
                    onChange={() => handleSelect(contact._id)}
                    checked={selectedContacts.includes(contact._id)}
                  />
                </td>
                <td
                  className="py-2 px-4 cursor-pointer text-blue-600"
                  onClick={() => navigate(`/contacts/${contact._id}`)}
                >
                  {contact.firstName} {contact.lastName}
                </td>
                <td className="py-2 px-4">{contact.email}</td>
                <td className="py-2 px-4">{contact.phone}</td>
                <td className="py-2 px-4">{contact.address}</td>
                <td className="py-2 px-4">
                  <button
                    onClick={() => openUpdateModal(contact)}
                    className="text-blue-600 hover:text-blue-800 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(contact._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4">
        <button
          onClick={handleMerge}
          className="bg-green-500 text-white px-4 py-2 rounded mr-2 hover:bg-green-600"
        >
          Merge Selected Contacts
        </button>
        <button
          onClick={() => setIsAddContactModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add New Contact
        </button>
      </div>

      {isAddContactModalOpen && (
        <AddContactModal
          onClose={() => setIsAddContactModalOpen(false)}
          onAddContact={handleAddContact}
        />
      )}
      {isUpdateContactModalOpen && contactToUpdate && (
        <UpdateContactModal
          onClose={() => setIsUpdateContactModalOpen(false)}
          onUpdateContact={handleUpdateContact}
          contactData={contactToUpdate} // Pass the selected contact data
        />
      )}
    </div>
  );
};

export default Home;
