const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const request = require('request');

// Create Express app
const app = express();

// Set EJS as the view engine
app.engine("html", engines.mustache);
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

// Render the EJS file on a specific route
app.get('/', (req, res) => {
    res.render('busApi');
});

// Create HTTP server
const server = http.createServer(app);

// Set up Socket.IO connection
const io = socketIo(server);

const url = 'http://apis.data.go.kr/1613000/BusLcInfoInqireService/getRouteAcctoBusLcList';

// Existing API call
const fetchData = () => {
    const queryParams = '?' + encodeURIComponent('serviceKey') + '=rpF5tThUUqO49KRisZSu0oazJROB6fq7lzmgJq6JBEBbqNpXd1LycCoJOy5XerfyyWsxYg2d97%2FZwriVHTc3zQ%3D%3D';
    queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1');
    queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('10');
    queryParams += '&' + encodeURIComponent('_type') + '=' + encodeURIComponent('json');
    queryParams += '&' + encodeURIComponent('cityCode') + '=' + encodeURIComponent('25');
    queryParams += '&' + encodeURIComponent('routeId') + '=' + encodeURIComponent('DJB30300052');

    request({
        url: url + queryParams,
        method: 'GET'
    }, function (error, response, body) {
        const jsonResponse = JSON.parse(body);
        const routeType = jsonResponse.response.body.items.item[0].routetp;
        console.log('Route Type:', routeType);

        // Emit the updated data to connected clients
        io.emit('routeTypeUpdated', routeType);
    });
};

// Set up Socket.IO connection
io.on('connection', (socket) => {
    console.log('A user connected');

    // Emit initial data on connection
    fetchData();

    // Schedule periodic data updates
    setInterval(() => {
        fetchData();
    }, 60000); // Update every 60 seconds

    // Handle disconnections
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Serve your API and Socket.IO on the same server
server.listen(3002, () => {
    console.log('Server is running on http://localhost:3002');
});
