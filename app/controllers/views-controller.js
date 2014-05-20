var usersModel = require("../models/users-model");

var viewsRenderer = {
    /*
     * @description 404 error view
     */
    error404: function(req, res) {
        res.status(404);
        res.render("../views/404",
           {
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
                welcomeMessage: "Welcome to our playground!"
            }
        );
    }
};

module.exports = viewsRenderer;