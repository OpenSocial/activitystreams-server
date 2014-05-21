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

    app = express();

// Application configuration
app.use(favicon(path.join(__dirname, "public/images/favicon.ico")));

app.use(bodyParser());

app.use(methodOverride());

app.set("views", __dirname + "/app/views");

app.set("view engine", "jade");

app.use(errorHandler());

// Static file server watching on the "public" folder and returning the static content
app.use(express.static(path.join(__dirname, "public")));

// Generate route map
routeMap(app);

// Server is listening on configuration port
app.listen(config.get("port"), function() {
    console.log("Express server listening on port " + config.get("port"));
});