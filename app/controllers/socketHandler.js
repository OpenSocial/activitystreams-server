var usersModel = require("../models/users-model");

module.exports = function(io) {
    var connectedClients = [],
        findClientByUserID = function(userID) {
            for (var i = 0, l = connectedClients.length; i < l; i++) {
                if (connectedClients[i].userID === userID) {
                    return i;
                }
            }
            return -1;
        },
        findClientBySocketID = function(socketID) {
            for (var i = 0, l = connectedClients.length; i < l; i++) {
                if (connectedClients[i].socket.id === socketID) {
                    return i;
                }
            }
            return -1;
        };

    /*
     * @description Handshake with the client connected
     */
    io.sockets.on("connection", function(socket) {
        socket.emit("clientConnected");
        socket.on("clientSendsData", function(userID) {
            connectedClients.push({
                userID: userID,
                socket: socket
            });
        });

        socket.on("disconnect", function() {
            var clientIndex = findClientBySocketID(socket.id);
            if (clientIndex >= 0) {
                connectedClients.splice(clientIndex, 1);
            }
        });

        socket.on("userAddedActivity", function(userID, activity) {
            // Get the logged in user info
            usersModel.getUser(userID, function(error, user) {
                if (!error) {
                    for (var i = 0, l = user.followers.length; i < l; i++) {
                        var follower = user.followers[i],
                            followerIndex = findClientByUserID(follower);
                        if (followerIndex >= 0) {
                            connectedClients[followerIndex].socket.emit("followingAddedActivity", activity);
                        }
                    }
                }
            });
        });
    });
};
