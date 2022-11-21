import React, { useState, useEffect } from "react";
import Form from "./components/Form";
import ContactCard from "./components/ContactCard";

export default function App() {
  const [contacts, setContacts] = useState([]);
  const [showError, setShowError] = useState("");
  const [selectedContact, setSelectedContact] = useState(false);

  /**
   * TODO:
   * [ ] - Check response and look for errors from database call (Update, Insert, Delete)
   * [ ] - Scroll in div when many contacts
   */

  useEffect(() => {
    setShowError();
    async function getInitContacts() {
      console.log("Init Contacts");
      const response = await window.api.listContacts();
      if (response) {
        setContacts(response);
      } else {
        setShowError("Can't fetch contacts from database");
      }
    }
    getInitContacts();
  }, []);

  const handleFormSubmit = async function (data) {
    try {
      if (selectedContact !== false) {
        // Update Contact
        const newContactData = {
          id: selectedContact.id,
          firstName: data.firstName,
          lastName: data.lastName !== null ? data.lastName : "",
          phone: data.phone !== null ? data.phone : "",
          email: data.email !== null ? data.email : "",
        };

        setSelectedContact(false);

        //await updateContactInDB(newContact);
        await window.api.updateContact(JSON.stringify(newContactData));

        // Update contacts-array
        const updatedContacts = [...contacts].map((contact) => (contact.id === newContactData.id ? newContactData : contact));
        const sortedContacts = sortContactsByFirstName(updatedContacts);
        setContacts(sortedContacts);
      } else {
        // Create new Contact
        const newContactData = { firstName: data.firstName, lastName: data.lastName, phone: data.phone, email: data.email };

        // Add contact to DB
        await window.api.createContact(JSON.stringify(newContactData));

        // Sort array by firstname
        const sortedContacts = sortContactsByFirstName([...contacts, newContactData]);
        setContacts(sortedContacts);
      }
    } catch (err) {
      alert(err);
    }
  };

  const handleFormCancel = function () {
    setSelectedContact(false);
  };

  const handleFormDelete = async function () {
    const contactToDelete = selectedContact;
    setSelectedContact(false);

    setContacts([...contacts].filter((contact) => contact.id !== contactToDelete.id));

    await window.api.deleteContact(contactToDelete.id);
  };

  const sortContactsByFirstName = function (contacts) {
    const sortedContacts = contacts.sort((a, b) => a.firstName.localeCompare(b.firstName));
    return sortedContacts;
  };

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

          <div className="flex">
            <div className="bg-spruce basis-1/2 pt-3 pb-5">
              <div className="text-lg uppercase text-center pb-3 text-cold">{selectedContact ? "Update Contact" : "Add Contact"}</div>
              <Form onSubmit={handleFormSubmit} onCancel={handleFormCancel} onDelete={handleFormDelete} contact={selectedContact} />
            </div>
            <div className="basis-1/2 bg-red-50 pt-3 pb-5 px-5">
              <div className="text-lg uppercase text-center pb-3 text-soot">Contacts</div>

              {contacts?.map((contact, index) => {
                return (
                  <div key={index}>
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
