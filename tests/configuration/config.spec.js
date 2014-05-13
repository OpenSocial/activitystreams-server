describe("Configuration setup", function() {
    it("should check that express server uses port 80", function(next) {
        var config = require('../../libs/config');
        expect(config.get('port')).toBe(80);
        next();
    });
    it("should check that mongodb uri set up correctly to the database", function(next) {
        var config = require('../../libs/config');
        expect(config.get('mongoose:uri')).toBe("mongodb://localhost/as_server");
        next();
    });
});