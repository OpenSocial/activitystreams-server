(function($) {
    $(document).ready(function() {
        app.common.init();

        // Event bindings
        $("button[id^='follow']").click(app.followings.add);
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