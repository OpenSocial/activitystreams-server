var activityStreamsModel = require("../models/activity-streams-model");

var activityStream = {
    /*
     * @description REST method (HTTP POST /activitystreams/:userID)
     *              to add the activity entry for the user specified
     * @see http://opensocial.github.io/spec/2.5.1/Social-API-Server.xml#ActivityStreams-Service-Create
     */
    add: function(req, res) {
        var userID = req.params.userID ? req.params.userID : "@me",
            verb = req.body.verb,
            published = req.body.published,
            object = req.body.object,
            activity = {
                verb: verb,
                published: published,
                actor: userID,
                object: object
            };

        activityStreamsModel.add(activity, function(err, results) {
            if (!err) {
                res.send(
                    {
                        "activityID": results,
                        "success": "Activity has been successfully added!"
                    });
            } else {
                res.send({
                    "error": "Activity has not been successfully added!"
                });
            }
        });
    },

    /*
     * @description REST method (HTTP DELETE /activitystreams/:activityID)
     *              to delete the selected activity
     * @see http://opensocial.github.io/spec/2.5.1/Social-API-Server.xml#ActivityStreams-Service-Delete
     */
    remove: function(req, res) {
        var activityID = req.params.activityID;

        activityStreamsModel.remove(activityID, function(err, results) {
            if (!err) {
                res.send({
                    "success": "Activity has been successfully removed!"
                });
            } else {
                res.send({
                    "error": "Activity has not been successfully removed!"
                });
            }
        });
    },

    /*
     * @description REST method (HTTP GET /activitystreams/:userID)
     *              to get the list of activities by the parameters specified
     * @see http://opensocial.github.io/spec/2.5.1/Social-API-Server.xml#ActivityStreams-Service-GetActivityStreams
     */
    getActivities: function(req, res) {
        var userID = req.params.userID ? req.params.userID : "@me",
            offset = req.body.offset,
            count = req.body.count;

        activityStreamsModel.getActivities(userID, offset, count, function(err, activities) {
           if (!err) {
               activityStreamsModel.getActivitiesCount(userID, function(countErr, totalItems) {
                   if (!countErr) {
                       res.send({
                           "success": "Activity list has been successfully retrieved!",
                           "data": res.json({"totalItems": totalItems, "items": activities})
                       });
                   } else {
                       res.send({
                           "error": "Activity list has not been successfully retrieved!"
                       });
                   }
               });
           } else {
               res.send({
                   "error": "Activity list has not been successfully retrieved!"
               });
           }
        });
    }
};

module.exports = activityStream;