require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');

const { MONGODB_URI, PORT } = require('./utils/config');
const { errorHandler, unknownEndpoint } = require('./utils/middleware');
const {
  getAllPersons,
  getPersonById,
  deletePerson,
  createPerson,
  updatePerson,
  getInfo
} = require('./controllers/persons');

const app = express();

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
  if (req.method === 'POST' || req.method === 'PUT') {
    return JSON.stringify(req.body);
  }
  return ' ';
});
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-data'));

// Routes
app.get('/api/persons', getAllPersons);
app.get('/api/persons/:id', getPersonById);
app.delete('/api/persons/:id', deletePerson);
app.post('/api/persons', createPerson);
app.put('/api/persons/:id', updatePerson);
app.get('/info', getInfo);

// Middleware
app.use(unknownEndpoint);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});