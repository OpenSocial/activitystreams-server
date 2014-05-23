(function($) {
    var common = {
        userID: null,
        follwingsErrorArea: null,
        actionsErrorArea: null,
        nameDialog: null,
        objectType: null,
        objectName: null,
        objectImage: null,
        addActivityButton: null,
        nameDialogErrorArea: null,
        init: function() {
            this.userID = $("#loggedUserID").val();
            this.followingsErrorArea = $("#followingsErrorArea");
            this.actionsErrorArea = $("#actionsErrorArea");
            this.nameDialog = $("#nameDialog");
            this.objectType = $("#objectType");
            this.objectName = $("#objectName");
            this.objectImage = $("#objectImage");
            this.addActivityButton = $("#addActivity");
            this.nameDialogErrorArea = $("#nameDialogErrorArea");
        }
    };

    var followings = {
        add: function() {
            var followButton = $(this),
                followingID = followButton.find("[id^='followingID']").val(),
                isFollowedInput = followButton.find("[id^='isFollowed']"),
                isFollowed = isFollowedInput.val() === "true",
                type = isFollowed ? "DELETE" : "POST",
                followingRow = followButton.parent().parent();

            $.ajax({
                url: "/users/" + common.userID + "/followings/" + followingID,
                type: type,
                success: function(data) {
                    if (data.success) {

                        // The following has been deleted
                        if (isFollowed) {
                            isFollowedInput.val("false");
                            followButton.attr("title", "Follow");
                            // TODO: Delete activities from the central block

                        // The following has been added
                        } else {
                            isFollowedInput.val("true");
                            followButton.attr("title", "Unfollow");
                            // TODO: Add activities to the central block
                        }

                        followButton.find("span").toggleClass("glyphicon-plus").toggleClass("glyphicon-minus");
                        followingRow.toggleClass("info").toggleClass("success");
                    } else {
                        common.followingsErrorArea.text(data.error).parent().toggleClass("hidden");
                    }
                },
                error: function() {
                    common.followingsErrorArea.text("Unexpected error occured.").parent().toggleClass("hidden");
                }
            });
        }
    };

    var dictionary = {
        verbs: {
            "post": "posted",
            "recommend": "recommended",
            "add": "added"
        },
        objectTypes: {
            "photo": "glyphicon-picture",
            "video": "glyphicon-facetime-video",
            "note": "glyphicon-edit",
            "place": "glyphicon-map-marker",
            "audio": "glyphicon-music",
            "like": "glyphicon-heart"
        }
    };

    var actions = (function() {
        var addActivity = function(activity) {
            $.ajax({
                url: "/activitystreams/" + common.userID,
                type: "POST",
                data: activity,
                success: function(data) {
                    if (data.success) {
                        // TODO: 1. Show activity in "my activities" tab
                        //       2. Push activity to followings
                    } else {
                        common.actionsErrorArea.text(data.error).parent().toggleClass("hidden");
                    }
                },
                error: function() {
                    common.actionsErrorArea.text("Unexpected error occured.").parent().toggleClass("hidden");
                }
            });
        };

        var showNameDialog = function(objectType) {
            common.objectType.text(objectType);
            common.objectImage.removeClass().addClass("glyphicon " + dictionary.objectTypes[objectType]);
            common.objectName.val("");
            common.nameDialog.modal();
        };

        return {
            postPhoto: function() {
                showNameDialog("photo");
                common.addActivityButton.on("click", function() {
                    var objectName = common.objectName.val();
                    if (objectName !== "") {
                        var activity = {
                            "verb": "post",
                            "published": new Date(),
                            "object": {
                                "type": "photo",
                                "name": objectName
                            }
                        };
                        addActivity(activity);
                        common.nameDialog.modal("hide");
                        common.nameDialogErrorArea.parent().toggleClass("hidden");
                        common.addActivityButton.off("click");
                    } else {
                        common.nameDialogErrorArea.text("Please, enter the name to proceed").parent().toggleClass("hidden");
                    }
                });
            },

            postVideo: function() {

            },

            postNote: function() {

            },

            recommendPlace: function() {

            },

            postAudio: function() {

            },

            addLike: function() {

            }
        };
    })();

    var activityStreams = {
    };

    $(document).ready(function() {
        common.init();
        // Event bindings
        $("button[id^='follow']").click(followings.add);
        $("#postPhoto").click(actions.postPhoto);
        $("#postVideo").click(actions.postVideo);
        $("#postNote").click(actions.postNote);
        $("#recommendPlace").click(actions.recommendPlace);
        $("#postAudio").click(actions.postAudio);
        $("#addLike").click(actions.addLike);
    });
})(jQuery);