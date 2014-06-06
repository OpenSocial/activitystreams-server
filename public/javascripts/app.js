(function($) {
    $(document).ready(function() {
        // Common data initialization
        app.common.init();

        // Dictionary initialization
        app.dictionary.init();

        // Socket events
        app.common.socket.on("clientConnected", function() {
            app.common.socket.emit("clientSendsData", app.common.userID);
        });

        app.common.socket.on("followingAddedActivity", function(activity) {
            app.activityStreams.prependActivity(app.common.followingsActivityStreamsArea, activity, app.common.followingsActivityStreamsArea.find("tr").size());
        });

        // Event bindings
        $("button[id^='follow']").click(app.followings.addOrRemove);
        $("#postPhoto").click(app.actions.postPhoto);
        $("#postVideo").click(app.actions.postVideo);
        $("#postNote").click(app.actions.postNote);
        $("#recommendPlace").click(app.actions.recommendPlace);
        $("#postAudio").click(app.actions.postAudio);
        $("#addLike").click(app.actions.addLike);

        app.activityStreams.displayActivityStreams(app.common.myActivityStreamsArea, app.common.userID, true);
        if (app.common.followings.length > 0) {
            app.activityStreams.displayActivityStreams(app.common.followingsActivityStreamsArea, app.common.followings.join(), true);
        }
    });
})(jQuery);
