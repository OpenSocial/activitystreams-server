describe("Configuration setup", function() {
    it("should check that express server uses correct port", function() {
        var config = require('../../libs/config');
        expect(config.get('port')).toBe(8080);
    });
    it("should check that mongodb uri set up correctly to the database", function() {
        var config = require('../../libs/config');
        expect(config.get('mongodb:uri')).toBe("mongodb://localhost:27017/as_server");
    });
});