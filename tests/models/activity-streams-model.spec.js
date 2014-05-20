describe("Activity streams model (DAO)", function() {
    var activityStreamsModel = require("../../app/models/activity-streams-model"),
        activityID,
        activity = {
            verb: "post",
            published: new Date(),
            actor: "John Doe",
            object: "image"
        };

    it("adds activity to the database", function(done) {
        activityStreamsModel.add(activity, function(err, data) {
            expect(err).toBeNull();
            activityID = data;
            done();
        });
    });

    it("retrieves activities from the database", function(done) {
        activityStreamsModel.getActivities(activity.actor, 0, 1, function(err, data) {
            expect(err).toBeNull();
            expect(data[0]._id).toEqual(activityID);
            done();
        });
    });

    it("deletes activity from the database", function(done) {
       activityStreamsModel.remove(activityID, function(err, results) {
           expect(err).toBeNull();
           done();
       });
    });
});