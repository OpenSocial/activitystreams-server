// Express application init
var express = require("express"),

    // Path parsing module
    path = require("path"),

    // Configuration
    config = require("./libs/config"),

    // Route map
    routeMap = require("./app/controllers/route-map"),

    // Module to parse JSON in the requests
    bodyParser = require("body-parser"),

    // Error handler
    errorHandler = require("errorhandler"),

    // Includes the support for PUT and DELETE methods
    methodOverride = require("method-override"),

    // Favicon serving
    favicon = require("serve-favicon"),

    app = express(),

    socketIO = require("socket.io"),

    socketHandler = require("./app/controllers/socketHandler"),

    predefinedDataLoader = require("./app/controllers/predefinedDataLoader"),

    connectionString = config.get('mongodb:uri'),

    MongoClient = require('mongodb').MongoClient;

// Application configuration
app.use(favicon(path.join(__dirname, "public/images/favicon.ico")));

app.use(bodyParser());

app.use(methodOverride());

app.set("views", __dirname + "/app/views");

app.set("view engine", "jade");

app.use(errorHandler());

// Static file server watching on the "public" folder and returning the static content
app.use(express.static(path.join(__dirname, "public")));

// Initialize connection once
MongoClient.connect(connectionString, function(connectionError, database) {
    if (connectionError) {
        console.error(connectionError.message);
    } else {
        global.activitystreamsDB = database;

        // Set up server and sockets
        var server = require("http").createServer(app),
            io = socketIO.listen(server, { log: false });

        server.listen(config.get("port"));

        // Set up socket connections handler
        socketHandler(io);

        // Generate route map
        routeMap(app);

        // Load predefined data if hasn't already
        predefinedDataLoader();
    }
});
