var app = (function($, module) {

    /*
     * @description Followings block functions
     */
    module.followings = {
        addOrRemove: function() {
            var followButton = $(this),
                followingID = followButton.find("[id^='followingID']").val(),
                isFollowedInput = followButton.find("[id^='isFollowed']"),
                isFollowed = isFollowedInput.val() === "true",
                type = isFollowed ? "DELETE" : "POST",
                followingRow = followButton.parent().parent();

            $.ajax({
                url: "/users/" + app.common.userID + "/followings/" + followingID,
                type: type,
                success: function(data) {
                    if (data.success) {

                        // The following has been deleted
                        if (isFollowed) {
                            var indexToDelete = app.common.followings.indexOf(followingID);
                            app.common.followings.splice(indexToDelete, 1);
                            isFollowedInput.val("false");
                            followButton.attr("title", "Follow");

                            // Remove the activities from display, recalculate counter and show "empty" message if necessary
                            var activities = app.common.followingsActivityStreamsArea.find("tr").filter(":has(input[value='" + followingID + "'])"),
                                size = activities.size();
                            activities.remove();
                            app.common.followingsActivityStreamsAreaCount -= size;
                            if (app.common.followingsActivityStreamsAreaCount === 0) {
                                app.common.followingsActivityStreamsArea.html(app.common.emptyActivityStreamsAreaHTML);
                            }

                            // The following has been added
                        } else {
                            app.common.followings.push(followingID);
                            isFollowedInput.val("true");
                            followButton.attr("title", "Unfollow");
                            app.activityStreams.displayActivityStreams(app.common.followingsActivityStreamsArea, followingID, false);
                        }

                        followButton.find("span").toggleClass("glyphicon-plus").toggleClass("glyphicon-minus");
                        followingRow.toggleClass("info").toggleClass("success");
                    } else {
                        app.common.followingsErrorArea.text(data.error).parent().toggleClass("hidden");
                    }
                },
                error: function() {
                    app.common.followingsErrorArea.text("Unexpected error occured.").parent().toggleClass("hidden");
                }
            });
        }
    };

    return module;
})(jQuery, app || {});
