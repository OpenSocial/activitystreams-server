/**
 * @description Users DAO
 */

var MongoClient = require('mongodb').MongoClient,
    config = require('../../libs/config'),
    connectionString = config.get('mongodb:uri'),
    ObjectID = require('mongodb').ObjectID;

var DAO = {
    /*
     * @description Add the new user
     * @param user User to add
     */
    add: function(user, callback) {
        MongoClient.connect(connectionString, function(connectionError, db) {
            if (connectionError) {
                callback(new Error("Database connection error"), null);
            } else {
                db.collection("users").findOne(
                    {
                        name: user.name
                    },
                    function(searchError, result) {
                        if (result) {
                            callback(new Error("User " + user.name + " already exists"), null);
                        } else {
                            db.collection("users").insert(user, function(insertError, user) {
                                if (insertError) {
                                    callback(new Error("User insert error"), null);
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
                callback(new Error("Database connection error"), null);
            } else {
                // Find the user to add following to
               db.collection("users").update(
                    {
                        _id: new ObjectID(userID)
                    },
                    {
                        $addToSet: {followings: followingID}
                    },
                    function(followingsUpdateError) {
                        if (followingsUpdateError) {
                            callback(new Error("Followings update error"), null);
                        } else {
                            db.collection("users").update(
                                {
                                    _id: new ObjectID(followingID)
                                },
                                {
                                    $addToSet: {followers: userID}
                                },
                                function(followersUpdateError) {
                                    if (followersUpdateError) {
                                        callback(new Error("Followers update error"), null);
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
                callback(new Error("Database connection error"), null);
            } else {
                // Find the user to remove following from
                db.collection("users").update(
                    {
                        _id: new ObjectID(userID)
                    },
                    {
                        $pull: {followings: followingID}
                    },
                    function(followingsRemoveError) {
                        if (followingsRemoveError) {
                            callback(new Error("Following remove error"), null);
                        } else {
                            // Find the user to remove follower from
                            db.collection("users").update(
                                {
                                    _id: new ObjectID(followingID)
                                },
                                {
                                    $pull: {followers: userID}
                                },
                                function(followersUpdateError) {
                                    if (followersUpdateError) {
                                        callback(new Error("Follower remove error"), null);
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
                callback(new Error("Database connection error"), null);
            } else {
                offset = offset ? offset : 0;
                count = count ? count : "@all";

                db.collection("users").findOne(
                    {
                        _id: new ObjectID(userID)
                    },
                    function(getError, result) {
                        if (getError) {
                            callback(new Error("Followings retrieving error"), null);
                        } else {
                            var followingsToReturn = [];
                            if (count === "@all") {
                                followingsToReturn = result.followings;
                            } else {
                                for (var i = offset; i < offset + count; i++) {
                                    followingsToReturn.push(result.followings[i]);
                                }
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
     * @description Get the user information by ID
     * @param userID The ID to search user by
     */
    getUser: function(userID, callback) {
        MongoClient.connect(connectionString, function(connectionError, db) {
            if (connectionError) {
                callback(new Error("Database connection error"), null);
            } else {
                db.collection("users").findOne(
                    {
                        _id: new ObjectID(userID)
                    },
                    function(getError, result) {
                        if (getError) {
                            callback(new Error("Users retrieving error"), null);
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
     * @description Get the users list
     * @param offset The starting index to get data from (paging purposes)
     * @param count Number of documents to get (paging purposes). Specail value: "@all" to get all the users
     */
    getUsers: function(offset, count, callback) {
        MongoClient.connect(connectionString, function(connectionError, db) {
            if (connectionError) {
                callback(new Error("Database connection error"), null);
            } else {
                var options = {
                    sort: [["name", 1]]
                };
                if (count !== "@all") {
                    options.skip = offset;
                    options.limit = count;
                }

                db.collection("users").find({}, options).toArray(
                    function(getError, result) {
                        if (getError) {
                            callback(new Error("Users retrieving error"), null);
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
                callback(new Error("Database connection error"), null);
            } else {
                db.collection("users").count(
                    {},
                    function(getError, result) {
                        if (getError) {
                            callback(new Error("Users count retrieving error"), null);
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
                callback(new Error("Database connection error"), null);
            } else {
                // Find the user to remove
                db.collection("users").remove(
                    {
                        _id: new ObjectID(userID)
                    },
                    function(userRemoveError) {
                        if (userRemoveError) {
                            callback(new Error("User remove error"), null);
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
