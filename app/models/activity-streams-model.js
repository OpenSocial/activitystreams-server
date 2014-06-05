/**
 * @description Activity streams DAO
 */

var ObjectID = require("mongodb").ObjectID;

var DAO = {
    /*
     * @description Add the activity entry for the user specified
     * @param activity Activity to add
     */
    add: function(activity, callback) {
        activitystreamsDB.collection("activitystreams").insert(activity, function(insertError, result) {
            if (insertError) {
                callback(new Error("Activity insert error"), null);
            } else {
                callback(null, result[0]._id);
            }
        });
    },

    /*
     * @description Remove the selected activity entry for the user specified
     * @param activityID Activity to remove
     */
    remove: function(activityID, callback) {
        try {
            activitystreamsDB.collection("activitystreams").remove(
                {
                    _id: new ObjectID(activityID)
                },
                function(removeError, result) {
                    if (removeError) {
                        callback(new Error("Activity remove error"), null);
                    } else {
                        callback(null, true);
                    }
                }
            );
        } catch (e) {
            callback(new Error(e.message), null);
        }
    },

    /*
     * @description Get the activities list
     * @param userID User to get activities for
     * @param offset The starting index to get data from (paging purposes). Default: 0
     * @param count Number of documents to get (paging purposes). Default: @all
     */
    getActivities: function(userID, offset, count, callback) {
        offset = offset || 0;
        count = count || "@all";

        // Options set up
        var options = {
            sort: {published: 1}
        };
        if (count !== "@all") {
            options.skip = offset;
            options.limit = count;
        }

        var followings = userID.split(",");

        activitystreamsDB.collection("activitystreams").find(
            {
                "actor.id": {$in: followings}
            },
            options).toArray(function(getError, result) {
                if (getError) {
                    callback(new Error("Activities retrieving error"), null);
                } else {
                    if (!result) {
                        callback(null, []);
                    } else {
                        callback(null, result);
                    }
                }
            }
        );
    },

    /*
     * @description Get the activities count
     * @param userID User to get activities for
     */
    getActivitiesCount: function(userID, callback) {
        var followings = userID.split(",");

        activitystreamsDB.collection("activitystreams").count(
            {
                "actor.id": {$in: followings}
            },
            function(getError, result) {
                if (getError) {
                    callback(new Error("Activities count retrieving error"), null);
                } else {
                    if (!result) {
                        callback(null, 0);
                    } else {
                        callback(null, result);
                    }
                }
            }
        );
    }
};

module.exports = DAO;
