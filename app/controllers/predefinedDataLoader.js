var usersModel = require("../models/users-model"),
    activityStreamsModel = require("../models/activity-streams-model"),
    predefinedUsers = require("../../config/predefined_data/users.json"),
    predefinedActivityStreams = require("../../config/predefined_data/activitystreams.json"),
    ObjectID = require("mongodb").ObjectID;

module.exports = function() {
    usersModel.getUsersCount(function(err, count) {
        if (!err) {
            if (count === 0) {
                var i = 0, l = 0;
                for (i = 0, l = predefinedUsers.length; i < l; i++) {
                    var user = predefinedUsers[i];
                    user._id = new ObjectID(user._id);
                    usersModel.add(user, function() {});
                }

                for (i = 0, l = predefinedActivityStreams.length; i < l; i++) {
                    var activityStream = predefinedActivityStreams[i];
                    activityStream._id = new ObjectID(activityStream._id);
                    activityStreamsModel.add(activityStream, function() {});
                }
            }
        }
    });
};
