const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// Morgan logging configuration
morgan.token('post-data', (req) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body);
  }
  return ' ';
});
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-data'));

// Initial phonebook data
let persons = [
  { 
    "id": "1",
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": "2",
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": "3",
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": "4",
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
];

// Routes
// 3.1: Get all persons
app.get('/api/persons', (req, res) => {
  res.json(persons);
});

// 3.2: Info page
app.get('/info', (req, res) => {
  const requestTime = new Date();
  const entriesCount = persons.length;
  
  res.send(`
    <p>Phonebook has info for ${entriesCount} people</p>
    <p>${requestTime}</p>
  `);
});

// 3.3: Get single person by ID
app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  const person = persons.find(p => p.id === id);
  
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

// 3.4: Delete a person by ID
app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  persons = persons.filter(p => p.id !== id);
  
  res.status(204).end();
});

// 3.5: Add a new person
app.post('/api/persons', (req, res) => {
  const body = req.body;
  
  // 3.6: Error handling
  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'name or number is missing'
    });
  }
  
  const nameExists = persons.some(p => p.name === body.name);
  if (nameExists) {
    return res.status(400).json({
      error: 'name must be unique'
    });
  }
  
  // Generate ID
  const id = Math.floor(Math.random() * 1000000).toString();
  
  const person = {
    id: id,
    name: body.name,
    number: body.number
  };
  
  persons = persons.concat(person);
  res.json(person);
});

// Serve frontend for all other routes - FIXED VERSION
// Use a proper wildcard pattern that Express supports
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});