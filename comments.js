// Create Web server application
// Run: node comments.js
// Test in browser: http://localhost:3000

// Import modules
var http = require('http');
var url = require('url');
var qs = require('querystring');

// Array to hold comments
var comments = [];

// Create Web server
http.createServer(function (req, res) {
    // Get URL parts
    var path = url.parse(req.url).pathname;
    var query = url.parse(req.url).query;

    // Get query string as object
    var q = qs.parse(query);

    // Check for query string
    if (query) {
        // Add comment to array
        comments.push(q.comment);
    }

    // Display comments
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<h1>Comments</h1>');
    res.write('<ul>');
    for (var i in comments) {
        res.write('<li>' + comments[i] + '</li>');
    }
    res.write('</ul>');

    // Display form
    res.write('<form method="get">');
    res.write('<input name="comment">');
    res.write('<input type="submit" value="Submit">');
    res.write('</form>');

    // End response
    res.end();
}).listen(3000);
