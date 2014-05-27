/**
 * @description Activity streams DAO
 */

var MongoClient = require('mongodb').MongoClient,
    config = require('../../libs/config'),
    connectionString = config.get('mongodb:uri'),
    ObjectID = require('mongodb').ObjectID;

var DAO = {
    /*
     * @description Add the activity entry for the user specified
     * @param activity Activity to add
     */
    add: function(activity, callback) {
        MongoClient.connect(connectionString, function(connectionError, db) {
            if (connectionError) {
                callback(new Error("Database connection error"), null);
            } else {
                db.collection("activitystreams").insert(activity, function(insertError, result) {
                    if (insertError) {
                        callback(new Error("Activity insert error"), null);
                    } else {
                        callback(null, result[0]._id);
                    }
                    db.close();
                });
            }
        });
    },

    /*
     * @description Remove the selected activity entry for the user specified
     * @param activityID Activity to remove
     */
    remove: function(activityID, callback) {
        MongoClient.connect(connectionString, function(connectionError, db) {
            if (connectionError) {
                callback(new Error("Database connection error"), null);
            } else {
                db.collection("activitystreams").remove(
                    {
                        _id: new ObjectID(activityID)
                    },
                    function(removeError, result) {
                        if (removeError) {
                            callback(new Error("Activity remove error"), null);
                        } else {
                            callback(null, true);
                        }
                        db.close();
                    }
                );
            }
        });
    },

    /*
     * @description Get the activities list
     * @param userID User to get activities for
     * @param offset The starting index to get data from (paging purposes). Default: 0
     * @param count Number of documents to get (paging purposes). Default: @all
     */
    getActivities: function(userID, offset, count, callback) {
        MongoClient.connect(connectionString, function(connectionError, db) {
            if (connectionError) {
                callback(new Error("Database connection error"), null);
            } else {
                offset = offset ? offset : 0;
                count = count ? count : "@all";

                // Options set up
                var options = {
                    sort: {published: -1}
                };
                if (count !== "@all") {
                    options.skip = offset;
                    options.limit = count;
                }

                var followings = userID.split(",");

                db.collection("activitystreams").find(
                    {
                        "actor.id": {$in: followings}
                    },
                    options).toArray(function(getError, result) {
                        if (getError) {
                            callback(new Error("Activities retrieving error"), null);
                        } else {
                            callback(null, result);
                        }
                        db.close();
                    }
                );
            }
        });
    },

    /*
     * @description Get the activities count
     * @param userID User to get activities for
     */
    getActivitiesCount: function(userID, callback) {
        MongoClient.connect(connectionString, function(connectionError, db) {
            if (connectionError) {
                callback(new Error("Database connection error"), null);
            } else {
                var followings = userID.split(",");

                db.collection("activitystreams").count(
                    {
                        "actor.id": {$in: followings}
                    },
                    function(getError, result) {
                        if (getError) {
                            callback(new Error("Activities count retrieving error"), null);
                        } else {
                            callback(null, result);
                        }
                        db.close();
                    }
                );
            }
        });
    }
};

module.exports = DAO;