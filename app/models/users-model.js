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
                callback(new Error("Database connection error: " + connectionError.message), null);
            } else {
                db.collection("users").findOne(
                    {
                        name: user.name
                    },
                    function(searchError, result) {
                        if (result) {
                            callback(new Error("User " + user.name + " already exists."), null);
                        } else {
                            db.collection("users").insert(user, function(insertError, user) {
                                if (insertError) {
                                    callback(new Error("User insert error: " + insertError.message), null);
                                } else {
                                    callback(null, user[0]._id);
                                }
                                db.close();
                            });
                        }
                    }
                );
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
                callback(new Error("Database connection error: " + connectionError.message), null);
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
                            callback(new Error("Followings update error: " + followingsUpdateError.message), null);
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
                                        callback(new Error("Followers update error: " + followersUpdateError.message), null);
                                    } else {
                                        callback(null, true);
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
     * @description Remove the existing following
     * @param userID User to remove following from
     * @param followingID Following to remove
     */
    removeFollowing: function(userID, followingID, callback) {
        MongoClient.connect(connectionString, function(connectionError, db) {
            if (connectionError) {
                console.log("Database connection error: " + connectionError.message);
                callback(new Error("Database connection error: " + connectionError.message), null);
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
                            callback(new Error("Following remove error: " + followingsRemoveError.message), null);
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
                                        callback(new Error("Follower remove error: " + followersUpdateError.message), null);
                                    } else {
                                        callback(null, true);
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
     * @description Get the followings list
     * @param userID User to get followings for
     * @param offset The starting index to get data from (paging purposes). Default: 0
     * @param count Number of documents to get (paging purposes). Default: @all
     */
    getFollowings: function(userID, offset, count, callback) {
        MongoClient.connect(connectionString, function(connectionError, db) {
            if (connectionError) {
                callback(new Error("Database connection error: " + connectionError.message), null);
            } else {
                offset = offset ? offset : 0;
                count = count ? count : "@all";

                db.collection("users").findOne(
                    {
                        _id: userID
                    },
                    function(getError, result) {
                        if (getError) {
                            callback(new Error("Followings retrieving error: " + getError.message), null);
                        } else {
                            var followingsToReturn = [];
                            for (var i = offset; i < offset + count; i++) {
                                followingsToReturn.push(result.followings[i]);
                            }

                            callback(null, {followings: followingsToReturn, totalItems: result.followings.length});
                        }
                        db.close();
                    }
                );
            }
        });
    },

    /*
     * @description Get the users list
     * @param offset The starting index to get data from (paging purposes)
     * @param count Number of documents to get (paging purposes)
     */
    getUsers: function(offset, count, callback) {
        MongoClient.connect(connectionString, function(connectionError, db) {
            if (connectionError) {
                callback(new Error("Database connection error: " + connectionError.message), null);
            } else {
                db.collection("users").find(
                    {},
                    {
                        skip: offset,
                        limit: count
                    }).toArray(function(getError, result) {
                        if (getError) {
                            callback(new Error("Users retrieving error: " + getError.message), null);
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
     * @description Get the users count
     */
    getUsersCount: function(callback) {
        MongoClient.connect(connectionString, function(connectionError, db) {
            if (connectionError) {
                callback(new Error("Database connection error: " + connectionError.message), null);
            } else {
                db.collection("users").count(
                    {},
                    function(getError, result) {
                        if (getError) {
                            callback(new Error("Users count retrieving error: " + getError.message), null);
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
     * @description Remove the existing user
     * @param userID User to remove
     */
    removeUser: function(userID, callback) {
        MongoClient.connect(connectionString, function(connectionError, db) {
            if (connectionError) {
                callback(new Error("Database connection error: " + connectionError.message), null);
            } else {
                // Find the user to remove
                db.collection("users").remove(
                    {
                        _id: userID
                    },
                    function(userRemoveError) {
                        if (userRemoveError) {
                            callback(new Error("User remove error: " + userRemoveError.message), null);
                        } else {
                            callback(null, true);
                        }
                        db.close();
                    }
                );
            }
        });
    }
};

module.exports = DAO;