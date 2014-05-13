var map = {
    "/activitystreams": {
        "/:userID": {
            "/:groupID": {
                "/:appID": {
                    "/:activityID": {
                        "get": function(req, res) {
                            res.send("User " + req.params.userID + " from group " + req.params.groupID
                                     + " is trying to get activity " + req.params.activityID + " for app "
                                     + req.params.appID);
                        }
                    }
                }
            }
        }
    /*        get: users.list,
     delete: users.delete,
     '/:uid': {
     get: users.get,
     '/pets': {
     get: pets.list,
     '/:pid': {
     delete: pets.delete
     }
     }
     }*/
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