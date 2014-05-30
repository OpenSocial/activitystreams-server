describe("Configuration setup", function() {
    it("checks that express server uses correct port and db uri", function() {
        var config = require('../../libs/config');
        expect(config.get('port')).toBe(8080);
        expect(config.get('mongodb:uri')).toBe("mongodb://localhost:27017/as_server");
    });
});