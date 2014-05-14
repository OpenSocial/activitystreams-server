var activityStreamsController = require("./activity-streams-controller");

var map = {
    "/activitystreams": {
        "/:userID": {
            "/:activity": {
                "post": activityStreamsController.add,
                "put": activityStreamsController.update
            },
            "/:activityID": {
                "delete": activityStreamsController.remove
            },
            "/:groupID": {
                "/:appID": {
                    "/:activityID": {
                        "get": activityStreamsController.getActivities
                    }
                }
            }
        }
    }
};

var createRoutes = function(routeMap, app, route) {
    route = route || '';
    for (var key in routeMap) {
        switch (typeof routeMap[key]) {
            // { '/path': { ... }}
            case 'object':
                createRoutes(routeMap[key], app, route + key);
                break;
            // get: function(){ ... }
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