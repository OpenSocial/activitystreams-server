var usersModel = require("../models/users-model"),
    activityStreamsModel = require("../models/activity-streams-model"),
    predefinedUsers = require("../../config/predefined_data/users.json"),
    predefinedActivityStreams = require("../../config/predefined_data/activitystreams.json"),
    ObjectID = require("mongodb").ObjectID;

module.exports = function() {
    usersModel.getUsersCount(function(err, count) {
        if (!err) {
            if (count === 0) {
                for (var i1 = 0, l1 = predefinedUsers.length; i1 < l1; i1++) {
                    var user = predefinedUsers[i1];
                    user._id = new ObjectID(user._id);
                    usersModel.add(user, function(){});
                }

                for (var i2 = 0, l2 = predefinedActivityStreams.length; i2 < l2; i2++) {
                    var activityStream = predefinedActivityStreams[i2];
                    activityStreamsModel.add(activityStream, function(){});
                }
            }
        }
    });
};
