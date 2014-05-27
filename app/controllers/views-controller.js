var usersModel = require("../models/users-model"),
    activityStreamsModel = require("../models/activity-streams-model"),
    config = require('../../libs/config'),
    port = config.get("port");

var viewsRenderer = {
    /*
     * @description 404 error view
     */
    error404: function(req, res) {
        res.status(404);
        res.render("../views/404",
           {
               path: req.protocol + "://" + req.host + ":" + port,
               title: "404: File Not Found"
           }
        );
    },

    /*
     * @description 500 error view
     */
    error500: function(req, res, error) {
        res.status(500);
        res.render("../views/500",
            {
                path: req.protocol + "://" + req.host + ":" + port,
                title: "500: Internal Server Error",
                error: error
            }
        );
    },

    /*
     * @description Login page renderer
     */
    login: function(req, res) {
        usersModel.getUsers(0, "@all", function(err, results) {
            if (!err) {
                res.render("../views/login",
                    {
                        users: results,
                        usersToShow: 18,
                        usersPerLine: 6,
                        path: req.protocol + "://" + req.host + ":" + port,
                        welcomeMessage: "Please, introduce yourself..."
                    }
                );
            } else {
                res.render("../views/error",
                    {
                        error: err.message
                    }
                );
            }
        });
    },

    /*
     * @description Activity streams page renderer
     */
    activityStreams: function(req, res) {
        var noView = req.query.noView === "true";

        // Return the data without view rendering
        if (noView) {
            var userID = req.params.userID,
                offset = req.query.offset,
                count = req.query.count;

            activityStreamsModel.getActivities(userID, offset, count, function(err, activities) {
                if (!err) {
                    activityStreamsModel.getActivitiesCount(userID, function(countErr, totalItems) {
                        if (!countErr) {
                            res.send({
                                "success": "Activity list has been successfully retrieved!",
                                "totalItems": totalItems,
                                "items": activities
                            });
                        } else {
                            res.send({
                                "error": err.message
                            });
                        }
                    });
                } else {
                    res.send({
                        "error": err.message
                    });
                }
            });

        // Get the data and render the view
        } else {
            // Get all the users
            usersModel.getUsers(0, "@all", function(err, users) {
                if (!err) {
                    // Get the logged in user info
                    usersModel.getUser(req.params.userID, function(innerError, user) {
                        if (!innerError) {
                            // Delete the logged user from the result array
                            for (var i = 0; i < users.length; i++) {
                                if (String(users[i]._id) === String(user._id)) {
                                    users.splice(i, 1);
                                }
                            }

                            res.render("../views/activity-streams",
                                {
                                    users: users,
                                    path: req.protocol + "://" + req.host + ":" + port,
                                    loggedUser: user
                                }
                            );



                        } else {
                            res.render("../views/error",
                                {
                                    error: innerError.message
                                }
                            );
                        }
                    });
                } else {
                    res.render("../views/error",
                        {
                            error: err.message
                        }
                    );
                }
            });
        }
    }
};

module.exports = viewsRenderer;