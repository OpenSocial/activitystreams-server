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
        "get": viewsController.activityStreams,
        "/:userID": {
            "get": activityStreamsController.getActivities,
            "post": activityStreamsController.add
        },
        "/:activityID": {
            "delete": activityStreamsController.remove
        }
    },
    "/users": {
        "get": usersController.getUsers,
        "/:userName": {
            "post": usersController.add,
            "/:followingID": {
                "post": usersController.addFollowing,
                "delete": usersController.removeFollowing
            }
        }
    }
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
};

module.exports = generateRouteMap;