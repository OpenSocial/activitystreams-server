/**
 * @description Activity streams
 */

var MongoClient = require('mongodb').MongoClient,
    config = require('../../libs/config'),
    connectionString = config.get('mongodb:uri');

var DAO = {
    add: function(activity) {
        MongoClient.connect(connectionString, function(connectionError, db) {
            if (connectionError) {
                console.log("Database connection error: " + connectionError.message);
                return false;
            } else {
                return db.collection("activitystreams").insert(activity, function(insertError, result) {
                    if (insertError) {
                        console.log("Activity insert error: " + insertError.message);
                        return false;
                    }
                    db.close();
                    return true;
                });
            }
        });
    },

    update: function(newActivity) {
        MongoClient.connect(connectionString, function(connectionError, db) {
            if (connectionError) {
                console.log("Database connection error: " + connectionError.message);
                return false;
            } else {
                return db.collection("activitystreams").update({id: newActivity.id}, {$set: newActivity}, function(updateError, result) {
                    if (updateError) {
                        console.log("Activity update error: " + updateError.message);
                        return false;
                    }
                    db.close();
                    return true;
                });
            }
        });
    },

    remove: function(activityID) {
        MongoClient.connect(connectionString, function(connectionError, db) {
            if (connectionError) {
                console.log("Database connection error: " + connectionError.message);
                return false;
            } else {
                return db.collection("activitystreams").remove({id: activityID}, function(removeError, result) {
                    if (removeError) {
                        console.log("Activity remove error: " + removeError.message);
                        return false;
                    }
                    db.close();
                    return true;
                });
            }
        });
    },

    getActivities: function(userID, groupID, appID, activityID, offset, count) {
        MongoClient.connect(connectionString, function(connectionError, db) {
            if (connectionError) {
                console.log("Database connection error: " + connectionError.message);
                return false;
            } else {
                return db.collection("activitystreams").find(
                    {
                        actor: userID,
                        id: activityID
                    },
                    {
                        skip: offset,
                        limit: count
                    },
                    function(getError, result) {
                        if (getError) {
                            console.log("Activities retrieving error: " + getError.message);
                            return false;
                        }
                        db.close();
                        return result;
                    }
                );
            }
        });
    },

    getActivitiesCount: function(userID, groupID, appID, activityID) {
        MongoClient.connect(connectionString, function(connectionError, db) {
            if (connectionError) {
                console.log("Database connection error: " + connectionError.message);
                return false;
            } else {
                return db.collection("activitystreams").count(
                    {
                        actor: userID,
                        id: activityID
                    },
                    function(getError, result) {
                        if (getError) {
                            console.log("Activities count retrieving error: " + getError.message);
                            return false;
                        }
                        db.close();
                        return result;
                    }
                );
            }
        });
    }
};

module.exports = DAO;