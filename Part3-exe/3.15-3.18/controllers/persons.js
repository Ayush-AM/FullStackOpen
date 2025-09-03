const Person = require('../models/person');

// Get all persons
const getAllPersons = async (req, res, next) => {
  try {
    const persons = await Person.find({});
    res.json(persons);
  } catch (error) {
    next(error);
  }
};

// Get person by ID
const getPersonById = async (req, res, next) => {
  try {
    const person = await Person.findById(req.params.id);
    if (person) {
      res.json(person);
    } else {
      res.status(404).end();
    }
  } catch (error) {
    next(error);
  }
};

// Delete person by ID (3.15)
const deletePerson = async (req, res, next) => {
  try {
    const result = await Person.findByIdAndDelete(req.params.id);
    if (result) {
      res.status(204).end();
    } else {
      res.status(404).end();
    }
  } catch (error) {
    next(error);
  }
};

// Create new person
const createPerson = async (req, res, next) => {
  try {
    const body = req.body;

    if (!body.name || !body.number) {
      return res.status(400).json({
        error: 'name or number is missing'
      });
    }

    const person = new Person({
      name: body.name,
      number: body.number,
    });

    const savedPerson = await person.save();
    res.json(savedPerson);
  } catch (error) {
    next(error);
  }
};

// Update person (3.17)
const updatePerson = async (req, res, next) => {
  try {
    const body = req.body;

    if (!body.number) {
      return res.status(400).json({
        error: 'number is missing'
      });
    }

    const updatedPerson = await Person.findByIdAndUpdate(
      req.params.id,
      { number: body.number },
      { new: true, runValidators: true, context: 'query' }
    );

    if (updatedPerson) {
      res.json(updatedPerson);
    } else {
      res.status(404).end();
    }
  } catch (error) {
    next(error);
  }
};

// Get info (3.18)
const getInfo = async (req, res, next) => {
  try {
    const count = await Person.countDocuments({});
    const requestTime = new Date();
    res.send(`
      <p>Phonebook has info for ${count} people</p>
      <p>${requestTime}</p>
    `);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPersons,
  getPersonById,
  deletePerson,
  createPerson,
  updatePerson,
  getInfo
};