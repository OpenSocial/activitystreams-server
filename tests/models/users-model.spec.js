describe("Users model (DAO)", function() {
    var usersModel = require("../../app/models/users-model"),
        userID,
        followingID,
        user = {
            name: "John Doe",
            followings: [],
            followers: []
        },
        anotherUser = {
            name: "John Doe 2",
            followings: [],
            followers: []
        };

    it("adds user to the database", function(done) {
        usersModel.add(user, function(err, data) {
            expect(err).toBeNull();
            userID = data;
            usersModel.add(anotherUser, function(innerErr, innerData) {
                followingID = innerData;
                done();
            });
        });
    });

    it("adds existing user to the database", function(done) {
        usersModel.add(user, function(err, results) {
            expect(err).not.toBeNull();
            done();
        });
    });

    it("adds followings to the user", function(done) {
        usersModel.addFollowing(userID, followingID, function(err, results) {
            expect(err).toBeNull();
            done();
        });
    });

    it("retrieves followings for the user", function(done) {
        usersModel.getFollowings(userID, 0, 1, function(err, results) {
            expect(err).toBeNull();
            expect(results.followings.length).toBeGreaterThan(0);
            expect(results.totalItems).toBeGreaterThan(0);
            done();
        });
    });

    it("removes following from the user", function(done) {
        usersModel.removeFollowing(userID, followingID, function(err, results) {
            expect(err).toBeNull();
            done();
        });
    });

    it("retrieves user by ID from the database", function(done) {
        //console.log(userID);
        usersModel.getUser(userID, function(err, result) {
            expect(err).toBeNull();
            //console.log(userID == result._id);
            //console.log(userID === result._id);
            expect(result).not.toBeNull();
            done();
        });
    });

    it("retrieves users from the database", function(done) {
        usersModel.getUsers(0, 1, function(err, users) {
            expect(err).toBeNull();
            done();
        });
        usersModel.getUsers(0, "@all", function(err, users) {
            expect(err).toBeNull();
            done();
        });
    });

    it("removes user from the database", function(done) {
        usersModel.removeUser(userID, function(err, results) {
            expect(err).toBeNull();
            usersModel.removeUser(followingID, function(innerErr, innerResults) {
                done();
            });
        });
    });
});