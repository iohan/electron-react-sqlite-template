import logo from "./logo.svg";
import "./App.css";
import { useState } from "react";

function App() {
    const [contacts, setContacts] = useState([]);
    const getContacts = async () => {
        const contacts = await window.api.getContacts();

        contacts !== null && setContacts(contacts);
    };

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    Edit <code>src/App.js</code> and save to reload.
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
                <br />
                <div>
                    {contacts?.map((contact, i) => {
                        return (
                            <p key={i}>
                                {contact.name} - {contact.email}
                            </p>
                        );
                    })}
                </div>
                <button onClick={getContacts}>Get Contacts</button>
            </header>
        </div>
    );
}

export default App;
