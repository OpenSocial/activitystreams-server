var activityStreamsModel = require("../models/activity-streams-model");

var activityStream = {
    /*
     * @description REST method (HTTP POST /activitystreams/:userID)
     *              to add the activity entry for the user specified
     * @see http://opensocial.github.io/spec/2.5.1/Social-API-Server.xml#ActivityStreams-Service-Create
     */
    add: function(req, res) {
        var userID = req.userID ? req.userID : "@me",
            verb = req.body.verb,
            published = req.body.published,
            object = req.body.object,
            activity = {
                verb: verb,
                published: published,
                actor: userID,
                object: object
            };

        activityStreamsModel.add(activity, function(result, data) {
            if (result) {
                res.send(
                    {
                        "activityID": data,
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
        var activityID = req.activityID;

        activityStreamsModel.remove(activityID, function(result) {
            if (result) {
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
        var userID = req.userID ? req.userID : "@me",
            offset = req.body.offset,
            count = req.body.count;

        activityStreamsModel.getActivities(userID, offset, count, function(result, data) {
           if (result) {
               activityStreamsModel.getActivitiesCount(userID, function(countResult, totalItems) {
                   if (countResult) {
                       res.send({
                           "success": "Activity list has been successfully retrieved!",
                           "data": res.json({"totalItems": totalItems, "data": data})
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