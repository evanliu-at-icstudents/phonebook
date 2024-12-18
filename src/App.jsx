import { useState, useEffect } from 'react';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
import personsService from './services/persons';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    personsService.getAll().then(initialPersons => {
      setPersons(initialPersons);
    });
  }, []);

  const addPerson = (event) => {
    event.preventDefault();
    const duplicate = persons.find(person => person.name === newName);

    if (duplicate) {
      if (window.confirm(`${newName} is already in the phonebook. Replace the old number with a new one?`)) {
        const updatedPerson = { ...duplicate, number: newNumber };
        personsService.update(duplicate.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person =>
              person.id === duplicate.id ? returnedPerson : person
            ));
            setNewName('');
            setNewNumber('');
          });
      }
      return;
    }

    const newPerson = { name: newName, number: newNumber };
    personsService.create(newPerson)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson));
        setNewName('');
        setNewNumber('');
      });
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personsService.remove(id).then(() => {
        setPersons(persons.filter(person => person.id !== id));
      });
    }
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const personsToShow = filter
    ? persons.filter(person => 
        (person.name.toLowerCase() + person.number).includes(filter.toLowerCase())
      )
    : persons;

  return (
    <>
      <h1>Phonebook</h1>
      <Filter value={filter} onChange={handleFilterChange} />

      <h2>Add a New Contact</h2>
      <PersonForm 
        onSubmit={addPerson}
        nameValue={newName}
        onNameChange={handleNameChange}
        numberValue={newNumber}
        onNumberChange={handleNumberChange}
      />

      <h2>Numbers</h2>
      <Persons 
        persons={personsToShow} 
        handleDelete={handleDelete} 
      />
    </>
  );
};

export default App;
