//var views = require("./views");
var activityStreamsModel = require("../models/activity-streams-model"),
    asms = require("../../libs/activitystreams");

var activityStream = {
    add: function(req, res) {
        var result = activityStreamsModel.add(req.activity);
        // TODO: redirect
        if (result) {
            res.send("Activity has been successfully added!");
        } else {
            res.send("Activity has not been successfully added!");
        }
    },

    update: function(req, res) {
        var result = activityStreamsModel.update(req.activity);
        // TODO: redirect
        if (result) {
            res.send("Activity has been successfully updated!");
        } else {
            res.send("Activity has not been successfully updated!");
        }
    },

    remove: function(req, res) {
        var result = activityStreamsModel.remove(req.activityID);
        // TODO: redirect
        if (result) {
            res.send("Activity has been successfully removed!");
        } else {
            res.send("Activity has not been successfully removed!");
        }
    },

    getActivities: function(req, res) {
        var result = activityStreamsModel.getActivities(req.userID, req.groupID, req.appID, req.activityID, 0, 100);
        // TODO: redirect
        if (result) {
            res.send("Activity list has been successfully retrieved!");
        } else {
            res.send("Activity list has not been successfully retrieved!");
        }
    }
};

module.exports = activityStream;