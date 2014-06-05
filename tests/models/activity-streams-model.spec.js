describe("Activity streams model (DAO)", function() {
    var activityStreamsModel = require("../../app/models/activity-streams-model"),
        activityID,
        activity = {
            verb: "post",
            published: new Date(),
            actor: "537ddf1ac5f8210427a156bc",
            object: "image"
        },
        config = require("../../libs/config"),
        connectionString = config.get('mongodb:uri'),
        MongoClient = require('mongodb').MongoClient;

    it("connects to the database", function(done) {
        MongoClient.connect(connectionString, function(connectionError, database) {
            if (connectionError) {
                expect(true).toBeFalsy();
            } else {
                global.activitystreamsDB = database;
            }
            done();
        });
    });

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