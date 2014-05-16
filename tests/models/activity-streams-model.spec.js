describe("Activity streams model (DAO)", function() {
    var activityStreamsModel = require("../../app/models/activity-streams-model"),
        activityID,
        activity = {
            verb: "post",
            published: new Date(),
            actor: "John Doe",
            object: "image"
        };

    /*
     * @description Test checks if an activity can be successfully added to the database
     */
    it("adds activity to the database", function(done) {
        activityStreamsModel.add(activity, function(result, data) {
            expect(result).toBeTruthy();
            activityID = data;
            done();
        });
    });

    /*
     * @description Test checks if activities can be successfully retrieved from the database
     */
    it("retrieves activities from the database", function(done) {
        activityStreamsModel.getActivities(activity.actor, 0, 1, function(result, data) {
            expect(result).toBeTruthy();
            expect(data[0]._id).toEqual(activityID);
            done();
        });
    });

    /*
     * @description Test checks if an activity can be successfully deleted from the database
     */
    it("deletes activity from the database", function(done) {
       activityStreamsModel.remove(activityID, function(result) {
           expect(result).toBeTruthy();
           done();
       });
    });
});