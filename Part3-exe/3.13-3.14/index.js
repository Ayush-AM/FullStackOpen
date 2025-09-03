require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const Person = require('./models/person');
const { MONGODB_URI, PORT } = require('./utils/config');

// Connect to MongoDB
console.log('connecting to', MONGODB_URI);

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch((error) => {
    console.error('error connecting to MongoDB:', error.message);
  });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('dist'));

// Morgan configuration
morgan.token('post-data', (req) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body);
  }
  return ' ';
});
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-data'));

// Routes

// 3.13: Get all persons from database
app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then(persons => {
      res.json(persons);
    })
    .catch(error => next(error));
});

// Info page
app.get('/info', (req, res, next) => {
  Person.countDocuments({})
    .then(count => {
      const requestTime = new Date();
      res.send(`
        <p>Phonebook has info for ${count} people</p>
        <p>${requestTime}</p>
      `);
    })
    .catch(error => next(error));
});

// Get single person by ID
app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch(error => next(error));
});

// Delete a person by ID
app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(result => {
      if (result) {
        res.status(204).end();
      } else {
        res.status(404).end();
      }
    })
    .catch(error => next(error));
});

// 3.14: Add a new person to database
app.post('/api/persons', (req, res, next) => {
  const body = req.body;

  // Validation
  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'name or number is missing'
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save()
    .then(savedPerson => {
      res.json(savedPerson);
    })
    .catch(error => next(error));
});

// Error handling middleware
const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});