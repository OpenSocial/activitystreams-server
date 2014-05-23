var usersModel = require("../models/users-model");

var user = {
    /*
     * @description REST method (HTTP POST /users/:user)
     *              to add the new user
     */
    add: function(req, res) {
        var userName = req.params.user ? req.params.user : "Guest user",
            user = {
                "name": userName,
                "followings": [],
                "followers": []
            };

        usersModel.add(user, function(err, results) {
            if (!err) {
                res.send(
                    {
                        "userID": results,
                        "success": "User has been successfully added!"
                    });
            } else {
                res.send({
                    "error": err.message
                });
            }
        });
    },

    /*
     * @description REST method (HTTP POST /users/:user/followings/:followingID) to add new following
     */
    addFollowing: function(req, res) {
        var userID = req.params.user,
            followingID = req.params.followingID;
        usersModel.addFollowing(userID, followingID, function(err, results) {
            if (!err) {
                res.send({
                    "success": "Following has been successfully added!"
                });
            } else {
                res.send({
                    "error": err.message
                });
            }
        });
    },

    /*
     * @description REST method (HTTP GET /users/:user/followings) to get the followings
     */
    getFollowings: function(req, res) {
        var userID = req.params.user,
            offset = req.body.offset,
            count = req.body.count;

        usersModel.getFollowings(userID, offset, count, function(err, results) {
            if (!err) {
                res.send({
                    "totalItems": results.totalItems,
                    "followings": res.json(results.followings),
                    "success": "Following has been successfully removed!"
                });
            } else {
                res.send({
                    "error": err.message
                });
            }
        });
    },

    /*
     * @description REST method (HTTP DELETE /users/:user/followings/:followingID) to remove following
     */
    removeFollowing: function(req, res) {
        var userID = req.params.user,
            followingID = req.params.followingID;
        usersModel.removeFollowing(userID, followingID, function(err, results) {
            if (!err) {
                res.send({
                    "success": "Following has been successfully removed!"
                });
            } else {
                res.send({
                    "error": err.message
                });
            }
        });
    },

    /*
     * @description REST method (HTTP GET /users) to get the list of users
     */
    getUsers: function(req, res) {
        var offset = req.body.offset,
            count = req.body.count;

        usersModel.getUsers(offset, count, function(err, users) {
            if (!err) {
                usersModel.getUsersCount(function(countErr, countUsers) {
                    if (!countErr) {
                        res.send({
                            "success": "Users list has been successfully retrieved!",
                            "data": res.json({
                                "totalItems": countUsers,
                                "items": users
                            })
                        });
                    } else {
                        res.send({
                            "error": err.message
                        });
                    }
                });
            } else {
                res.send({
                    "error": err.message
                });
            }

        });
    },

    /*
     * @description REST method (HTTP DELETE /users/:user) to remove user
     */
    removeUser: function(req, res) {
        var userID = req.params.user;
        usersModel.removeUser(userID, function(err, results) {
            if (!err) {
                res.send({
                    "success": "User has been successfully removed!"
                });
            } else {
                res.send({
                    "error": err.message
                });
            }
        });
    }
};

module.exports = user;