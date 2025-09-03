require('dotenv').config();
const mongoose = require('mongoose');
const Person = require('./models/person');
const { MONGODB_URI } = require('./utils/config');

// Connect to database
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  });

// Check if password is provided
if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password> [name] [number]');
  process.exit(1);
}

// Handle command line arguments
if (process.argv.length === 3) {
  // List all entries
  Person.find({})
    .then(persons => {
      console.log('phonebook:');
      persons.forEach(person => {
        console.log(`${person.name} ${person.number}`);
      });
      mongoose.connection.close();
    });
} else if (process.argv.length === 5) {
  // Add new entry
  const name = process.argv[3];
  const number = process.argv[4];
  
  const person = new Person({
    name: name,
    number: number,
  });
  
  person.save()
    .then(savedPerson => {
      console.log(`added ${savedPerson.name} number ${savedPerson.number} to phonebook`);
      mongoose.connection.close();
    })
    .catch(error => {
      console.error('Error saving person:', error.message);
      mongoose.connection.close();
    });
} else {
  console.log('Invalid number of arguments. Usage:');
  console.log('To list all entries: node mongo.js');
  console.log('To add new entry: node mongo.js <name> <number>');
  mongoose.connection.close();
}