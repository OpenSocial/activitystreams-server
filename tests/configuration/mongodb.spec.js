describe("MongoDB service", function() {
    it("should connect to database", function(next) {
        var config = require('../../libs/config'),
            mongoose = require('mongoose'),
            db = mongoose.connection;

        db.once('connected', function() {
            expect(true).toBe(true);
            next();
        });

        mongoose.connect(config.get('mongoose:uri'));
    });
});