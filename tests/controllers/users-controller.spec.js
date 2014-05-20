describe("Users controller", function() {
    var usersController = require("../../app/controllers/users-controller"),
        userID,
        followingID = "12398sdkjf2Es",
        userName = "John Doe",
        anotherUserName = "Abraham Lincoln";

    it("adds user to the database via controller", function(done) {
        var req = {}, res = {};
        req.params = {
            user: userName
        };
        res.send = function(response) {
            expect(response.success).toBeDefined();
            userID = response.userID;
            done();
        };
        usersController.add(req, res);
    });

    it("adds following to the user in the database via controller", function(done) {
        var req = {}, res = {};
        req.params = {
            user: userID,
            followingID: followingID
        };
        res.send = function(response) {
            expect(response.success).toBeDefined();
            done();
        };
        usersController.addFollowing(req, res);
    });

    it("retrieves followings from the database via controller", function(done) {
        var req = {}, res = {};
        req.params = {
            user: userID
        };
        req.body = {
            "offset": 0,
            "count": 1
        };
        res.send = function(response) {
            expect(response.success).toBeDefined();
            done();
        };
        res.json = function(data) {
            return data;
        };
        usersController.getFollowings(req, res);
    });

    it("deletes following from the database via controller", function(done) {
        var req = {}, res = {};
        req.params = {
            user: userID,
            followingID: followingID
        };
        res.send = function(response) {
            expect(response.success).toBeDefined();
            done();
        };
        usersController.removeFollowing(req, res);
    });

    it("retrieves users from the database via controller", function(done) {
        var req = {}, res = {};
        req.body = {
            "offset": 0,
            "count": 1
        };
        res.send = function(response) {
            expect(response.success).toBeDefined();
            done();
        };
        res.json = function(data) {
            return data;
        };
        usersController.getUsers(req, res);
    });

    it("removes user from the database via controller", function(done) {
        var req = {}, res = {};
        req.params = {
            user: userID
        };
        res.send = function(response) {
            expect(response.success).toBeDefined();
            done();
        };
        usersController.removeUser(req, res);
    });
});