var usersModel = require("../models/users-model"),
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
     * @description Main page renderer
     */
    activityStreams: function(req, res) {
        usersModel.getUsers(0, "@all", function(err, results) {
            if (!err) {
                usersModel.getUser(req.params.userID, function(innerError, user) {
                    if (!innerError) {
                        // Delete the logged user from the result array
                        for (var i = 0; i < results.length; i++) {
                            if (String(results[i]._id) === String(user._id)) {
                                results.splice(i, 1);
                            }
                        }

                        res.render("../views/activity-streams",
                            {
                                users: results,
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
};

module.exports = viewsRenderer;