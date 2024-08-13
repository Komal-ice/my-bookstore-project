const express = require('express');
const app = express();
const axios = require('axios');
const path = require('path');
const fs = require('fs');

// Load books data
const booksPath = path.join(__dirname, 'books.json');
let books = JSON.parse(fs.readFileSync(booksPath, 'utf-8'));

app.use(express.json());

// Task 1: Get the book list available in the shop
app.get('/books', (req, res) => {
  res.json(books);
});

// Task 2: Get the books based on ISBN
app.get('/books/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = books.find((book) => book.isbn === isbn);
  if (!book) {
    res.status(404).json({ message: 'Book not found' });
  } else {
    res.json(book);
  }
});

// Task 3: Get all books by Author
app.get('/books/author/:author', (req, res) => {
  const author = req.params.author;
  const booksByAuthor = books.filter((book) => book.author === author);
  res.json(booksByAuthor);
});

// Task 4: Get all books based on Title
app.get('/books/title/:title', (req, res) => {
  const title = req.params.title;
  const booksByTitle = books.filter((book) => book.title === title);
  res.json(booksByTitle);
});

// Task 5: Get book Review
app.get('/books/:isbn/reviews', (req, res) => {
  const isbn = req.params.isbn;
  const book = books.find((book) => book.isbn === isbn);
  if (!book) {
    res.status(404).json({ message: 'Book not found' });
  } else {
    res.json(book.reviews || []);
  }
});

// Task 6: Register New user
app.post('/users', (req, res) => {
  const user = req.body;
  // Add user to database (not implemented)
  res.json({ message: 'User registered successfully' });
});

// Task 7: Login as a Registered user
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  // Authenticate user (not implemented)
  res.json({ message: 'User logged in successfully' });
});

// Task 8: Add/Modify a book review
app.post('/books/:isbn/reviews', (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body;
  const book = books.find((book) => book.isbn === isbn);
  if (!book) {
    res.status(404).json({ message: 'Book not found' });
  } else {
    if (!book.reviews) {
      book.reviews = [];
    }
    book.reviews.push(review);
    fs.writeFileSync(booksPath, JSON.stringify(books, null, 2), 'utf-8');
    res.json({ message: 'Review added successfully' });
  }
});

// Task 9: Delete book review added by that particular user
app.delete('/books/:isbn/reviews/:reviewId', (req, res) => {
  const isbn = req.params.isbn;
  const reviewId = req.params.reviewId;
  const book = books.find((book) => book.isbn === isbn);
  if (!book) {
    res.status(404).json({ message: 'Book not found' });
  } else {
    const reviewIndex = book.reviews.findIndex((review) => review.id === reviewId);
    if (reviewIndex !== -1) {
      book.reviews.splice(reviewIndex, 1);
      fs.writeFileSync(booksPath, JSON.stringify(books, null, 2), 'utf-8');
      res.json({ message: 'Review deleted successfully' });
    } else {
      res.status(404).json({ message: 'Review not found' });
    }
  }
});

// Task 10: Get all books – Using async callback function
app.get('/async-books', (req, res) => {
  axios.get('http://localhost:3000/books')
    .then(response => {
      const books = response.data;
      setTimeout(() => {
        res.json(books);
      }, 2000); // simulate async delay
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: 'Error fetching books' });
    });
});

// Task 11: Search by ISBN – Using Promises
app.get('/promise-isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  axios.get(`http://localhost:3000/books/${isbn}`)
    .then(response => {
      const book = response.data;
      if (!book) {
        res.status(404).json({ message: 'Book not found' });
      } else {
        res.json(book);
      }
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: 'Error fetching book' });
    });
});

// Task 12: Search by Author
app.get('/author/:author', (req, res) => {
  const author = req.params.author;
  axios.get(`http://localhost:3000/books/author/${author}`)
    .then(response => {
      const books = response.data;
      res.json(books);
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: 'Error fetching books' });
    });
});

// Task 13: Search by Title
app.get('/title/:title', (req, res) => {
  const title = req.params.title;
  axios.get(`http://localhost:3000/books/title/${title}`)
    .then(response => {
      const books = response.data;
      res.json(books);
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: 'Error fetching books' });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
