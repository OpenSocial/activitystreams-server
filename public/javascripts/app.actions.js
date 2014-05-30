var app = (function($, module) {

    /*
     * @description Create activity
     * @verb Verb to link the activity with
     * @objectType Type of activity object
     */
    var createActivity = function(verb, objectType) {

        /*
         * @description Add activity to the database
         * @param activity Activity to add
         */
        var addActivity = function(activity) {
            $.ajax({
                url: "/activitystreams/" + app.common.userID,
                type: "POST",
                data: activity,
                success: function(data) {
                    if (data.success) {
                        activity.actor = {
                            id: app.common.userID,
                            name: app.common.userName
                        };
                        activity._id = data.activityID;
                        app.activityStreams.prependActivity(app.common.myActivityStreamsArea, activity, app.common.myActivityStreamsArea.find("tr").size());
                        app.common.socket.emit("userAddedActivity", app.common.userID, activity);
                    } else {
                        app.common.actionsErrorArea.text(data.error).parent().toggleClass("hidden");
                    }
                },
                error: function() {
                    app.common.actionsErrorArea.text("Unexpected error occured.").parent().toggleClass("hidden");
                }
            });
        };

        /*
         * @description Generates an activity and send it to the database
         * @verb Verb to link the activity with
         * @objectType Type of activity object
         */
        var generateActivity = function() {
            var objectName = app.common.objectName.val();
            objectName = objectName.replace(/\\/gm, "\\").replace(/"/gm, "\"");
            if (objectName !== "") {
                var obj = asms.Activity({
                    verb: 'post',
                    actor: 'acct:joe@example.org',
                    object: 'http://example.org/notes/1',
                    testField: "ololo"
                });

                var activityObj = asms.Activity({
                        "verb": verb,
                        "published": new Date(),
                        "object": {
                            "type": objectType,
                            "name": objectName
                        }
                    }),
                    activity = activityObj.__wrapped__;
                addActivity(activity);
                app.common.nameDialog.modal("hide");
                app.common.addActivityButton.off("click");
            } else {
                app.common.nameDialogErrorArea.text("Please, enter the name to proceed").parent().removeClass("hidden");
            }
        };

        /*
         * @description Show the modal dialog
         */
        var showNameDialog = function() {
            var performedVerb = app.dictionary.verbs[verb];
            if (objectType === "like") {
                app.common.nameDialogLabel.text("Please, enter the name of the object you " + performedVerb + " " + objectType + " to");
            } else {
                app.common.nameDialogLabel.text("Please, enter the name of the " + objectType + " you " + performedVerb);
            }
            app.common.objectImage.removeClass().addClass("glyphicon " + app.dictionary.objectTypes[objectType]);
            app.common.objectName.val("");
            app.common.nameDialogErrorArea.parent().addClass("hidden");
            app.common.nameDialog.modal();
            app.common.addActivityButton.on("click", generateActivity);
        };

        /*
         * Main logic flow
         */
        showNameDialog();
    };

    module.actions = {
        postPhoto: function() {
            createActivity("post", "photo");
        },

        postVideo: function() {
            createActivity("post", "video");
        },

        postNote: function() {
            createActivity("post", "note");
        },

        recommendPlace: function() {
            createActivity("recommend", "place");
        },

        postAudio: function() {
            createActivity("post", "audio");
        },

        addLike: function() {
            createActivity("add", "like");
        }
    };

    return module;
})(jQuery, app || {});
