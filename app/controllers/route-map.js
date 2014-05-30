var activityStreamsController = require("./activity-streams-controller"),
    usersController = require("./users-controller"),
    viewsController = require("./views-controller");

/*
 * @description Define the route map
 */
var map = {
    "/": {
        "get": viewsController.login
    },
    "/activitystreams": {
        "/:userID": {
            "get": viewsController.activityStreams,
            "post": activityStreamsController.add
        },
        "/:activityID": {
            "delete": activityStreamsController.remove
        }
    },
    "/users": {
        "get": usersController.getUsers,
        "/:user": {
            "post": usersController.add,
            "delete": usersController.removeUser,
            "/followings": {
                "get": usersController.getFollowings,
                "/:followingID": {
                    "post": usersController.addFollowing,
                    "delete": usersController.removeFollowing
                }
            }
        }
    }
};

/*
 * @description Set error handlers
 */
var errorHandlers = function(app) {
    // Handle 404
    app.use(function(req, res) {
        viewsController.error404(req, res);
    });

    // Handle 500
    app.use(function(error, req, res, next) {
        viewsController.error500(req, res, error);
    });
};

/*
 * @description Function to parse route map into Express router paths
 */
var createRoutes = function(routeMap, app, route) {
    route = route || '';
    for (var key in routeMap) {
        switch (typeof routeMap[key]) {
            case 'object':
                createRoutes(routeMap[key], app, route + key);
                break;
            case 'function':
                app[key](route, routeMap[key]);
                break;
        }
    }
};

var generateRouteMap = function(app) {
    createRoutes(map, app);
    errorHandlers(app);
};

module.exports = generateRouteMap;
