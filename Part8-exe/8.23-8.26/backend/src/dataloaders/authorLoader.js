const DataLoader = require('dataloader');
const Book = require('../models/Book');

// Batch function to get book counts for multiple authors
const batchBookCounts = async (authorIds) => {
  const bookCounts = await Book.aggregate([
    { $match: { author: { $in: authorIds.map(id => mongoose.Types.ObjectId(id)) } } },
    { $group: { _id: '$author', count: { $sum: 1 } } }
  ]);
  
  // Map results to the same order as input authorIds
  return authorIds.map(id => {
    const countObj = bookCounts.find(c => c._id.toString() === id);
    return countObj ? countObj.count : 0;
  });
};

// Create the DataLoader instance
const authorLoader = new DataLoader(batchBookCounts);

module.exports = authorLoader;