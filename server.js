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

    socketIO = require("socket.io");

// Application configuration
app.use(favicon(path.join(__dirname, "public/images/favicon.ico")));

app.use(bodyParser());

app.use(methodOverride());

app.set("views", __dirname + "/app/views");

app.set("view engine", "jade");

app.use(errorHandler());

// Static file server watching on the "public" folder and returning the static content
app.use(express.static(path.join(__dirname, "public")));

// Set up server and sockets
var server = require("http").createServer(app),
    io = socketIO.listen(server, { log: false });

server.listen(config.get("port"));

// Generate route map
routeMap.setIO(io);
routeMap.generateRouteMap(app);