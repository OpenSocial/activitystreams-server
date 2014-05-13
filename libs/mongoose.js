/**
 * @description Application model (schemas)
 */

var mongoose = require('mongoose'),
    config = require('./config/config'),
    log = require('./log')(module),
    db = mongoose.connection;

mongoose.connect(config.get('mongoose:uri'));

db.on('error', function(err) {
    log.error('Connection error: ', err.message);
});

db.once('connected', function() {
    log.info("Successfully connected!");
});