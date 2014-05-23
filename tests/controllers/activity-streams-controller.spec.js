describe("Activity streams controller", function() {
    var activityStreamsController = require("../../app/controllers/activity-streams-controller"),
        activityID,
        verb = "post",
        published = new Date(),
        actor = "537ddf1ac5f8210427a156bc",
        object = "image";

    it("adds activity to the database via controller", function(done) {
        var req = {}, res = {};
        req.params = {
            userID: actor
        };
        req.body = {
            verb: verb,
            published: published,
            object: object
        };
        res.send = function(response) {
            expect(response.success).toBeDefined();
            activityID = response.activityID;
            done();
        };
        activityStreamsController.add(req, res);
    });

    it("retrieves activities from the database via controller", function(done) {
        var req = {}, res = {};
        req.params = {
            userID:actor
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
        activityStreamsController.getActivities(req, res);
    });

    it("deletes activity from the database via controller", function(done) {
        var req = {}, res = {};
        req.params = {
            activityID: activityID
        };
        res.send = function(response) {
            expect(response.success).toBeDefined();
            done();
        };
        activityStreamsController.remove(req, res);
    });
});