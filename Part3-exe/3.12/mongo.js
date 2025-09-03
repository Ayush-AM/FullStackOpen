require('dotenv').config();
const mongoose = require('mongoose');

// Check if MONGODB_URI is set
if (!process.env.MONGODB_URI) {
  console.log('Please set MONGODB_URI environment variable');
  process.exit(1);
}

const url = process.env.MONGODB_URI;

// ... rest of the code remains the same, but remove password handling
// Define person schema and model
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

// Connect to MongoDB
mongoose.connect(url)
  .then(() => {
    console.log('Connected to MongoDB');
    
    // If only password is provided, list all entries
    if (process.argv.length === 3) {
      return Person.find({});
    }
    
    // If name and number are provided, add new entry
    if (process.argv.length === 5) {
      const name = process.argv[3];
      const number = process.argv[4];
      
      const person = new Person({
        name: name,
        number: number,
      });
      
      return person.save();
    }
    
    // Invalid number of arguments
    console.log('Invalid number of arguments. Usage:');
    console.log('To list all entries: node mongo.js <password>');
    console.log('To add new entry: node mongo.js <password> <name> <number>');
    return Promise.reject('Invalid arguments');
  })
  .then(result => {
    // Handle the result based on the operation
    if (process.argv.length === 3) {
      // Listing all entries
      console.log('phonebook:');
      result.forEach(person => {
        console.log(`${person.name} ${person.number}`);
      });
    } else if (process.argv.length === 5) {
      // Added new entry
      console.log(`added ${result.name} number ${result.number} to phonebook`);
    }
    
    // Close the connection
    return mongoose.connection.close();
  })
  .then(() => {
    console.log('Connection closed');
  })
  .catch(err => {
    console.error('Error:', err);
    mongoose.connection.close();
  });