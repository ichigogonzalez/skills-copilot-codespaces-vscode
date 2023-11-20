// Create web server
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { randomBytes } = require('crypto');

// Create express app
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Create comments object
const commentsByPostId = {};

// Get comments by post id
app.get('/posts/:id/comments', (req, res) => {
    res.send(commentsByPostId[req.params.id] || []);
});

// Create comment by post id
app.post('/posts/:id/comments', (req, res) => {
    const commentId = randomBytes(4).toString('hex');
    const { content } = req.body;

    // Get comments by post id
    const comments = commentsByPostId[req.params.id] || [];
    comments.push({ id: commentId, content });

    // Update comments
    commentsByPostId[req.params.id] = comments;

    res.status(201).send(comments);
});

// Listen on port 4001
app.listen(4001, () => {
    console.log('Comments service listening on port 4001');
});