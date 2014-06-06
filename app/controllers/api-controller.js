/*
 * @description API (actions) calls
 */

var api = {
    /*
     * @description REST method (HTTP GET /api/see)
     *              to perform the 'see' action
     */
    see: function(req, res) {
        var action = req.query.action;

        if (action) {
            res.send(
                {
                    "success": "Action '" + action + "' has been successfully performed!"
                });
        } else {
            res.send(
                {
                    "error": "Action is not defined!"
                });
        }
    },

    /*
     * @description REST method (HTTP GET /api/share)
     *              to perform the 'share' action
     */
    share: function(req, res) {
        var action = req.query.action;

        if (action) {
            res.send(
                {
                    "success": "Action '" + action + "' has been successfully performed!"
                });
        } else {
            res.send(
                {
                    "error": "Action is not defined!"
                });
        }
    }
};

module.exports = api;
