import React, { useState, useEffect } from "react";
import Form from "./components/Form";
import ContactCard from "./components/ContactCard";

export default function App() {
  const [contacts, setContacts] = useState([]);
  const [showError, setShowError] = useState("");
  const [selectedContact, setSelectedContact] = useState(false);

  useEffect(() => {
    setShowError();
    initContacts();
  }, []);

  const initContacts = async () => {
    // Get from DB
    const response = await window.api.listContacts();

    if (response) {
      setContacts(response);
    } else {
      setShowError("Can't fetch contacts from database");
    }
  };

  const updateContact = async (data) => {
    const newContactData = {
      id: selectedContact.id,
      firstName: data.firstName,
      lastName: data.lastName !== null ? data.lastName : "",
      phone: data.phone !== null ? data.phone : "",
      email: data.email !== null ? data.email : "",
    };

    setSelectedContact(false);

    // Update in DB
    const response = await window.api.updateContact(JSON.stringify(newContactData));

    if (response) {
      const updatedContacts = [...contacts].map((contact) => (contact.id === newContactData.id ? newContactData : contact));
      const sortedContacts = sortContactsByFirstName(updatedContacts);
      setContacts(sortedContacts);
    } else {
      setShowError("Error while updating contact");
    }
  };

  const createContact = async (data) => {
    const newContactData = { firstName: data.firstName, lastName: data.lastName, phone: data.phone, email: data.email };

    // Add to DB
    const response = await window.api.createContact(JSON.stringify(newContactData));

    if (response) {
      const sortedContacts = sortContactsByFirstName([...contacts, newContactData]);
      setContacts(sortedContacts);
    } else {
      setShowError("Error while creating contact.");
    }
  };

  const deleteContact = async () => {
    const contactToDelete = selectedContact;
    setSelectedContact(false);

    // Delete from DB
    const response = await window.api.deleteContact(contactToDelete.id);

    if (response) {
      setContacts([...contacts].filter((contact) => contact.id !== contactToDelete.id));
    } else {
      setShowError("Error while deleting contact.");
    }
  };

  const handleFormSubmit = async function (data) {
    setShowError();
    try {
      if (selectedContact !== false) {
        updateContact(data);
      } else {
        createContact(data);
      }
    } catch (err) {
      setShowError(err);
    }
  };

  const handleFormCancel = () => {
    setShowError();
    setSelectedContact(false);
  };

  const handleFormDelete = async () => {
    setShowError();
    deleteContact();
  };

  const sortContactsByFirstName = (contacts) => contacts.sort((a, b) => a.firstName.localeCompare(b.firstName));

  return (
    <div className="bg-cold h-screen">
      <div className="max-w-[600px] m-auto py-5">
        <div className="text-xl text-center mb-2 text-soot">Contacts App</div>
        <div className="rounded-lg bg-white drop-shadow-md overflow-clip">
          {showError && (
            <div className="bg-wood text-soot p-3 text-center text-sm">
              <strong>Error: </strong>
              {showError}
            </div>
          )}

          <div className="flex max-h-[450px]">
            <div className="bg-spruce basis-1/2 pt-3 pb-5">
              <div className="text-lg uppercase text-center pb-3 text-cold">{selectedContact ? "Update Contact" : "Add Contact"}</div>
              <Form onSubmit={handleFormSubmit} onCancel={handleFormCancel} onDelete={handleFormDelete} contact={selectedContact} />
            </div>
            <div className="basis-1/2 bg-red-50 pt-3 pb-5 px-5 overflow-scroll">
              <div className="text-lg uppercase text-center pb-3 text-soot">Contacts</div>

              {contacts?.map((contact, index) => {
                return (
                  <div key={index} className="cursor-pointer">
                    <ContactCard contact={contact} onClick={(contact) => setSelectedContact(contact)} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
