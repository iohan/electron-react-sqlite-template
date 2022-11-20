import logo from "./logo.svg";
import "./App.css";
import { useState } from "react";

function App() {
    const [contacts, setContacts] = useState([]);
    const [books, setBooks] = useState([]);

    const getContacts = async () => {
        const contacts = await window.api.getContacts();

        contacts !== null && setContacts(contacts);
    };

    const getBooks = async () => {
        const books = await window.api.getBooks();
        books !== null && setBooks(books);
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
                <button onClick={getBooks}>Get Books</button>
                <div className="bg-slate-50 text-slate-800 m-3 rounded-lg">
                    {books?.map((book, i) => {
                        return (
                            <div
                                key={i}
                                className="border-b p-3 last:border-0 md:flex md:items-center"
                            >
                                <div className="font-bold mr-2 cursor-pointer">
                                    {book.title}
                                </div>
                                <div className="text-xs italic">
                                    {book.category} - {book.year}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </header>
        </div>
    );
}

export default App;
