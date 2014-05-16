var usersModel = require("../models/users-model");

var user = {
    /*
     * @description REST method (HTTP POST /users/:userName)
     *              to add the new user
     */
    add: function(req, res) {
        var userName = req.userName ? req.userName : "Guest user",
            user = {
                "name": userName,
                "followings": [],
                "followers": []
            },
            result = usersModel.add(user);
        if (result.result) {
            res.send(
                {
                    "userID": result.data,
                    "success": "User has been successfully added!"
                });
        } else {
            res.send({
                "error": "User has not been successfully added!"
            });
        }
    },

    /*
     * @description REST method (HTTP POST /users/:userID/:followingID) to add new following
     */
    addFollowing: function(req, res) {
        var userID = req.userID,
            followingID = req.followingID,
            result = usersModel.addFollowing(userID, followingID);
        if (result) {
            res.send({
                "success": "Following has been successfully added!"
            });
        } else {
            res.send({
                "error": "Following has not been successfully added!"
            });
        }
    },

    /*
     * @description REST method (HTTP DELETE /users/:userID/:followingID) to remove following
     */
    removeFollowing: function(req, res) {
        var userID = req.userID,
            followingID = req.followingID,
            result = usersModel.removeFollowing(userID, followingID);
        if (result) {
            res.send({
                "success": "Following has been successfully removed!"
            });
        } else {
            res.send({
                "error": "Following has not been successfully removed!"
            });
        }
    },

    /*
     * @description REST method (HTTP GET /users) to get the list of users
     */
    getUsers: function(req, res) {
        var offset = req.body.offset,
            count = req.body.count,
            result = usersModel.getUsers(offset, count),
            totalItems = usersModel.getUsersCount(),
            dataToReturn = {};
        if (result.result) {
            dataToReturn["totalItems"] = totalItems;
            dataToReturn["items"] = result.data;
        }

        if (result.result) {
            res.send({
                "success": "Users list has been successfully retrieved!",
                "data": res.json(dataToReturn)
            });
        } else {
            res.send({
                "error": "Users list has not been successfully retrieved!"
            });
        }
    }
};

module.exports = user;