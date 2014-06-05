/**
 * @description Users DAO
 */

var ObjectID = require('mongodb').ObjectID;

var DAO = {
    /*
     * @description Add the new user
     * @param user User to add
     */
    add: function(user, callback) {
        activitystreamsDB.collection("users").findOne(
            {
                name: user.name
            },
            function(searchError, result) {
                if (searchError) {
                    callback(new Error("User search error"), null);
                } else {
                    if (result) {
                        callback(new Error("User " + user.name + " already exists"), null);
                    } else {
                        activitystreamsDB.collection("users").insert(user, function(insertError, user) {
                            if (insertError) {
                                callback(new Error("User insert error"), null);
                            } else {
                                callback(null, user[0]._id);
                            }
                        });
                    }
                }
            }
        );
    },

    /*
     * @description Add the new following
     * @param userID User to add following to
     * @param followingID Following to add
     */
    addFollowing: function(userID, followingID, callback) {
        try {
            // Find the user to add following to
            activitystreamsDB.collection("users").update(
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
                        activitystreamsDB.collection("users").update(
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
                            }
                        );
                    }
                }
            );
        } catch (e) {
            callback(new Error(e.message), null);
        }
    },

    /*
     * @description Remove the existing following
     * @param userID User to remove following from
     * @param followingID Following to remove
     */
    removeFollowing: function(userID, followingID, callback) {
        try {
            // Find the user to remove following from
            activitystreamsDB.collection("users").update(
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
                        activitystreamsDB.collection("users").update(
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
                            }
                        );
                    }
                }
            );
        } catch (e) {
            callback(new Error(e.message), null);
        }
    },

    /*
     * @description Get the followings list
     * @param userID User to get followings for
     * @param offset The starting index to get data from (paging purposes). Default: 0
     * @param count Number of documents to get (paging purposes). Default: @all
     */
    getFollowings: function(userID, offset, count, callback) {
        try {
            offset = offset || 0;
            count = count || "@all";

            activitystreamsDB.collection("users").findOne(
                {
                    _id: new ObjectID(userID)
                },
                function(getError, result) {
                    if (getError) {
                        callback(new Error("Followings retrieving error"), null);
                    } else {
                        if (!result) {
                            callback(null, {followings: [], totalItems: 0});
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
                    }
                }
            );
        } catch (e) {
            callback(new Error(e.message), null);
        }
    },

    /*
     * @description Get the user information by ID
     * @param userID The ID to search user by
     */
    getUser: function(userID, callback) {
        try {
            activitystreamsDB.collection("users").findOne(
                {
                    _id: new ObjectID(userID)
                },
                function(getError, result) {
                    if (getError) {
                        callback(new Error("Users retrieving error"), null);
                    } else {
                        if (!result) {
                            callback(new Error("No such a user found"), null);
                        } else {
                            callback(null, result);
                        }
                    }
                }
            );
        } catch (e) {
            callback(new Error(e.message), null);
        }
    },

    /*
     * @description Get the users list
     * @param offset The starting index to get data from (paging purposes)
     * @param count Number of documents to get (paging purposes). Specail value: "@all" to get all the users
     */
    getUsers: function(offset, count, callback) {
        var options = {
            sort: {name: 1}
        };

        offset = offset || 0;
        count = count || "@all";

        if (count !== "@all") {
            options.skip = offset;
            options.limit = count;
        }

        activitystreamsDB.collection("users").find({}, options).toArray(
            function(getError, result) {
                if (getError) {
                    callback(new Error("Users retrieving error"), null);
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
     * @description Get the users count
     */
    getUsersCount: function(callback) {
        activitystreamsDB.collection("users").count(
            {},
            function(getError, result) {
                if (getError) {
                    callback(new Error("Users count retrieving error"), null);
                } else {
                    if (!result) {
                        callback(null, 0);
                    } else {
                        callback(null, result);
                    }
                }
            }
        );
    },

    /*
     * @description Remove the existing user
     * @param userID User to remove
     */
    removeUser: function(userID, callback) {
        try {
            // Find the user to remove
            activitystreamsDB.collection("users").remove(
                {
                    _id: new ObjectID(userID)
                },
                function(userRemoveError) {
                    if (userRemoveError) {
                        callback(new Error("User remove error"), null);
                    } else {
                        callback(null, true);
                    }
                }
            );
        } catch (e) {
            callback(new Error(e.message), null);
        }
    }
};

module.exports = DAO;
