// Create Web server application

// Load modules
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();

// Define port number
const PORT = process.env.PORT || 3000;

// Set views directory
app.set('views', './views');

// Set view engine
app.set('view engine', 'ejs');

// Set body-parser middleware
app.use(bodyParser.urlencoded({extended: false}));

// Set static middleware
app.use('/public', express.static('public'));

// Create a new comment
app.post('/comments', (req, res) => {
    // Get the comment from the form
    let comment = req.body.comment;
    // Read the comments from the file
    let comments = fs.readFileSync('./data/comments.json', 'utf8');
    // Convert the comments to an array
    comments = JSON.parse(comments);
    // Add the new comment to the array
    comments.push(comment);
    // Save the comments back to the file
    fs.writeFileSync('./data/comments.json', JSON.stringify(comments));
    // Redirect to the comments page
    res.redirect('/comments');
});

// Display all comments
app.get('/comments', (req, res) => {
    // Read the comments from the file
    let comments = fs.readFileSync('./data/comments.json', 'utf8');
    // Convert the comments to an array
    comments = JSON.parse(comments);
    // Render the comments page
    res.render('comments', {comments: comments});
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
