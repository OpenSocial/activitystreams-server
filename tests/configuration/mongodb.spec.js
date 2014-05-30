describe("MongoDB service", function() {
    it("connects to database", function(done) {
        var config = require('../../libs/config'),
            MongoClient = require('mongodb').MongoClient;

        MongoClient.connect(config.get('mongodb:uri'), function(err, db) {
            expect(err).toBeNull();
            done();
        });
    });
});