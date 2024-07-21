// Create web server
// Run this file by typing `node comments.js` in the terminal
// And visit http://localhost:3000 in your browser
// Press Ctrl+C to stop the server

// Load the http module to create an http server.
var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');

var comments = [];

// Configure our HTTP server to respond with Hello World to all requests.
var server = http.createServer(function (request, response) {
    var url_parts = url.parse(request.url, true);
    var pathname = url_parts.pathname;
    var query = url_parts.query;

    if (pathname === '/') {
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.write('<html><body><h1>Comments</h1><ul>');
        comments.forEach(function (comment) {
            response.write('<li>' + comment + '</li>');
        });
        response.write('</ul>' +
            '<form method="post" action="/add-comment">' +
            '<input type="text" name="comment" />' +
            '<input type="submit" value="Add Comment" />' +
            '</form>' +
            '</body></html>');
        response.end();
    } else if (pathname === '/add-comment') {
        var comment = query['comment'];
        comments.push(comment);
        response.writeHead(302, {'Location': '/'});
        response.end();
    } else {
        var filePath = path.join(__dirname, pathname);
        fs.exists(filePath, function (exists) {
            if (exists) {
                response.writeHead(200, {'Content-Type': 'text/html'});
                fs.createReadStream(filePath).pipe(response);
            } else {
                response.writeHead(404, {'Content-Type': 'text/plain'});
                response.end('Page not found');
            }
        });
    }
});

// Listen on port 3000, IP defaults to