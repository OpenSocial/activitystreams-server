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
        usersModel.getUsers(0, 100, function(err, results) {
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
                // TODO: render error page
            }
        });
    },

    /*
     * @description Main page renderer
     */
    activityStreams: function(req, res) {
        res.render("../views/activity-streams",
            {
                path: req.protocol + "://" + req.host + ":" + port,
                welcomeMessage: "Welcome to our playground!"
            }
        );
    }
};

module.exports = viewsRenderer;