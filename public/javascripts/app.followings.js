app.followings = (function($) {

    /*
     * @description Followings block functions
     */
    return {
        add: function() {
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
                            app.common.followingsActivityStreamsArea.find("tr").filter(":has(input[value='" + followingID + "'])").remove();

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
})(jQuery);