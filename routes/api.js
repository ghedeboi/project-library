/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const Book = require('../models/book');

module.exports = function (app) {

  app.route('/api/books')
    .get(async (req, res) => {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      try {
        const books = await Book.find({});
        if (!books) {
          res.json([]);
          return;
        }
        const formatData = books.map((book) => {
          return {
            _id: book._id,
            title: book.title,
            comments: book.comments,
            commentcount: book.comments.length || 0,
          };
        });
        res.json(formatData);
        return;
      } catch (err) {
        res.json([]);
      }
    })
    
    .post(async (req, res) => {
      let title = req.body.title; // Get the title from the request body
      //response will contain new book object including atleast _id and title
      if (!title) {
        res.send('Missing required field title');
        return;
      }
      const newBook = new Book({ title, comments: [] }) // Create a new book object
      try {
        const book = await newBook.save(); // Save the book to the database
        res.json({ _id: book._id, title: book.title }); // Respond with the new book's _id and title
      } catch (error) {
        console.error(error);
        res.send('There was an error saving the book'); 
      }
    })
    
    .delete(async (req, res) => {
      //if successful response will be 'complete delete successful'
      try {
        await Book.deleteMany({}); // Delete all books from the database
        res.send('complete delete successful'); 
      } catch (error) {
        console.error(error);
        res.send('Internal server error'); 
      }
    });



  app.route('/api/books/:id')
    .get(async (req, res) => {
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      try {
        const book = await Book.findById(bookid); // Find the book and populate comments
        if (!book) return res.status(200).send('No book exists');
        res.json({
          comments: book.comments,
          _id: book._id,
          title: book.title,
          commentcount: book.comments.length || 0,
        }); // Send the book data as JSON
        console.log(book);
      } catch (error) {
        res.status(500).send('Server error'); 
      }
    })
    
    .post(async (req, res) => {
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      if (!comment) {
        res.send('Missing required field comment');
        return;
      }
      try {
        let book = await Book.findById(bookid); // Find the book by ID
        if (!book) return res.status(200).send('No book exists');
        
        book.comments.push(comment);
        book.commentcount = book.comments.length;
        await book.save(); // Save the updated book
        
        res.json({
          comments: book.comments,
          _id: book._id, 
          title: book.title,
          commentcount: book.comments.length,
        });
      } catch (err) {
        res.status(500).send("Server error")
      }
    })
    
    .delete(async (req, res) => {
      let bookID = req.params.id;
      //if successful response will be 'delete successful'
    try {
     const deleted = await Book.findByIdAndDelete(bookID); // Find the book by ID and delete it
      if (!deleted) throw new Error('No book exists');
      res.send('delete successful');
    } catch (error) {
      console.error(error);
      res.send('no book exists'); 
    }
    });
  
};
