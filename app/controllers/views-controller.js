var viewsRenderer = {
    /*
     * @description Login page renderer
     */
    login: function(req, res) {
        res.render("../views/login",
            {
                welcomeMessage: "Please, choose one of the users to play for"
            }
        );
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