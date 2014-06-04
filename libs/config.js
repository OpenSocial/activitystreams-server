var nconf = require("nconf");

nconf.env().argv().file({file: './config/config.json'});

if (process.env.VCAP_SERVICES) {
    var port = process.env.VCAP_APP_PORT || 3000,
        env = JSON.parse(process.env.VCAP_SERVICES),
        mongo = env['mongodb-2.2'][0]['credentials'];
    nconf.set("port", port);
    nconf.set("mongodb:uri", mongo.url);
}

module.exports = nconf;
