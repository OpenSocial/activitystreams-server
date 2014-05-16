/**
 * @description Activity streams DAO
 */

var MongoClient = require('mongodb').MongoClient,
    config = require('../../libs/config'),
    connectionString = config.get('mongodb:uri');

var DAO = {
    /*
     * @description Add the activity entry for the user specified
     * @param activity Activity to add
     */
    add: function(activity, callback) {
        MongoClient.connect(connectionString, function(connectionError, db) {
            if (connectionError) {
                console.log("Database connection error: " + connectionError.message);
                callback(false);
            } else {
                db.collection("activitystreams").insert(activity, function(insertError, result) {
                    if (insertError) {
                        console.log("Activity insert error: " + insertError.message);
                        callback(false);
                    } else {
                        callback(true, result[0]._id);
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
                console.log("Database connection error: " + connectionError.message);
                callback(false);
            } else {
                db.collection("activitystreams").remove({_id: activityID}, function(removeError, result) {
                    if (removeError) {
                        console.log("Activity remove error: " + removeError.message);
                        callback(false);
                    } else {
                        callback(true);
                    }
                    db.close();
                });
            }
        });
    },

    /*
     * @description Get the activities list
     * @param userID User to get activities for
     * @param offset The starting index to get data from (paging purposes)
     * @param count Number of documents to get (paging purposes)
     */
    getActivities: function(userID, offset, count, callback) {
        MongoClient.connect(connectionString, function(connectionError, db) {
            if (connectionError) {
                console.log("Database connection error: " + connectionError.message);
                callback(false);
            } else {
                db.collection("activitystreams").find(
                    {
                        actor: userID
                    },
                    {
                        skip: offset,
                        limit: count
                    }).toArray(function(getError, result) {
                        if (getError) {
                            console.log("Activities retrieving error: " + getError.message);
                            callback(false);
                        } else {
                            callback(true, result);
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
                console.log("Database connection error: " + connectionError.message);
                callback(false);
            } else {
                db.collection("activitystreams").count(
                    {
                        actor: userID
                    },
                    function(getError, result) {
                        if (getError) {
                            console.log("Activities count retrieving error: " + getError.message);
                            callback(false);
                        } else {
                            callback(true, result);
                        }
                        db.close();
                    }
                );
            }
        });
    }
};

module.exports = DAO;