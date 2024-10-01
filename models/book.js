const mongoose = require('mongoose'); // Import mongoose
const { Schema } = mongoose; // Import Schema

const BookSchema = new Schema({
  title: {type: String, required: true},
  comments: [String],
  commentcount: {type: Number, default: 0}
})
const Book = mongoose.model('Book', BookSchema); // Create the 'Book' model based on the schema

module.exports = Book; // Export the Book model