describe("MongoDB service", function() {
    it("should connect to database", function(done) {
        var config = require('../../libs/config'),
            MongoClient = require('mongodb').MongoClient;

        MongoClient.connect(config.get('mongodb:uri'), function(err, db) {
            except(err).toBeNull();
            done();
        });
    });
});