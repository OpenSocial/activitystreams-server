(function($) {
    $(document).ready(function() {
        // Common data initialization
        app.common.init();

        // Socket connection
        var socket = io.connect(app.common.path);
        socket.on("activityAdded", function(activity, sender) {
            if (sender.followers.indexOf(app.common.userID) >= 0) {
                app.activityStreams.prependActivity(app.common.followingsActivityStreamsArea, activity, app.common.followingsActivityStreamsArea.find("tr").size());
            }
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
