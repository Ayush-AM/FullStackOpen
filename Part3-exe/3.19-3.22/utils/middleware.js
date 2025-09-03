// Error handler middleware
const errorHandler = (error, req, res, next) => {
  console.error('Error:', error.message);

  if (error.name === 'CastError') {
    return res.status(400).json({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    // Extract and format validation errors
    const errors = Object.values(error.errors).map(e => e.message);
    return res.status(400).json({ error: errors.join(', ') });
  } else if (error.name === 'MongoServerError' && error.code === 11000) {
    return res.status(400).json({ error: 'name must be unique' });
  }

  next(error);
};

// Unknown endpoint middleware
const unknownEndpoint = (req, res) => {
  res.status(404).json({ error: 'unknown endpoint' });
};

module.exports = {
  errorHandler,
  unknownEndpoint
};