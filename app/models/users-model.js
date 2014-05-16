/**
 * @description Users DAO
 */

var MongoClient = require('mongodb').MongoClient,
    config = require('../../libs/config'),
    connectionString = config.get('mongodb:uri');

var DAO = {
    /*
     * @description Add the new user
     * @param user User to add
     */
    add: function(user, callback) {
        MongoClient.connect(connectionString, function(connectionError, db) {
            if (connectionError) {
                console.log("Database connection error: " + connectionError.message);
                callback(false);
            } else {
                db.collection("users").insert(user, function(insertError, user) {
                    if (insertError) {
                        console.log("User insert error: " + insertError.message);
                        callback(false);
                    } else {
                        callback(true, user[0]._id);
                    }
                    db.close();
                });
            }
        });
    },

    /*
     * @description Add the new following
     * @param userID User to add following to
     * @param followingID Following to add
     */
    addFollowing: function(userID, followingID, callback) {
        MongoClient.connect(connectionString, function(connectionError, db) {
            if (connectionError) {
                console.log("Database connection error: " + connectionError.message);
                callback(false);
            } else {
                // Find the user to add following to
               db.collection("users").update(
                    {
                        _id: userID
                    },
                    {
                        $addToSet: {followings: followingID}
                    },
                    function(followingsUpdateError) {
                        if (followingsUpdateError) {
                            console.log("Followings update error: " + followingsUpdateError.message);
                            callback(false);
                        } else {
                            db.collection("users").update(
                                {
                                    _id: followingID
                                },
                                {
                                    $addToSet: {followers: userID}
                                },
                                function(followersUpdateError) {
                                    if (followersUpdateError) {
                                        console.log("Followers update error: " + followersUpdateError.message);
                                        callback(false);
                                    } else {
                                        callback(true);
                                    }
                                    db.close();
                                }
                            );
                        }
                    }
                );
            }
        });
    },

    /*
     * @description Remove the new existing following
     * @param userID User to remove following from
     * @param followingID Following to remove
     */
    removeFollowing: function(userID, followingID, callback) {
        MongoClient.connect(connectionString, function(connectionError, db) {
            if (connectionError) {
                console.log("Database connection error: " + connectionError.message);
                callback(false);
            } else {
                // Find the user to remove following from
                db.collection("users").update(
                    {
                        _id: userID
                    },
                    {
                        $pull: {followings: followingID}
                    },
                    function(followingsRemoveError) {
                        if (followingsRemoveError) {
                            console.log("Following remove error: " + followingsRemoveError.message);
                            callback(false);
                        } else {
                            // Find the user to remove follower from
                            db.collection("users").update(
                                {
                                    _id: followingID
                                },
                                {
                                    $pull: {followers: userID}
                                },
                                function(followersUpdateError) {
                                    if (followersUpdateError) {
                                        console.log("Follower remove error: " + followersUpdateError.message);
                                        callback(false);
                                    } else {
                                        callback(true);
                                    }
                                    db.close();
                                }
                            );
                        }
                    }
                );
            }
        });
    },

    /*
     * @description Get the users list
     * @param userIDs Users to get information for
     * @param offset The starting index to get data from (paging purposes)
     * @param count Number of documents to get (paging purposes)
     */
    getUsers: function(offset, count, callback) {
        MongoClient.connect(connectionString, function(connectionError, db) {
            if (connectionError) {
                console.log("Database connection error: " + connectionError.message);
                callback(false);
            } else {
                db.collection("users").find(
                    {},
                    {
                        skip: offset,
                        limit: count
                    }).toArray(function(getError, result) {
                        if (getError) {
                            console.log("Users retrieving error: " + getError.message);
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
     * @description Get the users count
     */
    getUsersCount: function(callback) {
        MongoClient.connect(connectionString, function(connectionError, db) {
            if (connectionError) {
                console.log("Database connection error: " + connectionError.message);
                callback(false);
            } else {
                db.collection("users").count(
                    {},
                    function(getError, result) {
                        if (getError) {
                            console.log("Users count retrieving error: " + getError.message);
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