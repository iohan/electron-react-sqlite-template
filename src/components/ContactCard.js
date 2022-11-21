const ContactCard = ({ contact, onClick }) => {
  return (
    <div className="bg-clear flex items-center rounded-lg p-2 mb-2" onClick={() => onClick(contact)}>
      <div className="bg-spruce rounded-full text-cold w-10 h-10">
        <div className="text-center text-2xl pt-1 uppercase">{contact.firstName.charAt(0)}</div>
      </div>
      <div className="pl-2 text-soot">
        <div className="text-lg">
          {contact.firstName} {contact.lastName}
        </div>
        {contact.email && <div className="text-sm">{contact.email}</div>}
        {contact.phone && <div className="text-sm">{contact.phone}</div>}
      </div>
    </div>
  );
};

export default ContactCard;
