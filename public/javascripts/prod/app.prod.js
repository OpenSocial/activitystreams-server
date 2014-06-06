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
                        app.common.actionsErrorArea.parent().addClass("hidden");
                        activity.actor = {
                            id: app.common.userID,
                            displayName: app.common.userName
                        };
                        activity._id = data.activityID;
                        app.activityStreams.prependActivity(app.common.myActivityStreamsArea, activity, app.common.myActivityStreamsArea.find("tr").size());
                        app.common.socket.emit("userAddedActivity", app.common.userID, activity);
                    } else {
                        app.common.actionsErrorArea.text(data.error).parent().removeClass("hidden");
                    }
                },
                error: function() {
                    app.common.actionsErrorArea.text("Unexpected error occured.").parent().removeClass("hidden");
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
                var activityObj = asms.Activity({
                        "verb": verb,
                        "published": new Date().toISOString(),
                        "object": {
                            "objectType": objectType,
                            "displayName": objectName
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

var app = (function($, module) {
    /*
     * @description Make an action on the activity
     */
    var performAction = function() {
        var actionText = $(this).text(),
            action = app.dictionary.actions[actionText];

        $.ajax({
            url: action.url,
            type: action.method,
            data: {
                action: actionText
            },
            success: function(data) {
                if (data.success) {
                    app.common.activityStreamsErrorArea.parent().addClass("hidden");
                    $.bootstrapGrowl(data.success, {type: "success"});
                } else {
                    app.common.activityStreamsErrorArea.text(data.error).parent().removeClass("hidden");
                }
            },
            error: function() {
                app.common.activityStreamsErrorArea.text("Unexpected error occured.").parent().removeClass("hidden");
            }
        });
    };

    /*
     * @description Prepend one activity to the stream
     * @param area jQuery DOM wrapped area to append to
     * @param activity Activity to append
     * @param index Index of the activity in the stream
     */
    var prependActivity = function(area, activity, index) {
        // Cleaning the area and increasing the activities count
        if (area === app.common.myActivityStreamsArea) {
            if (app.common.myActivityStreamsAreaCount === 0) {
                area.empty();
            }
            app.common.myActivityStreamsAreaCount++;
        } else if (area === app.common.followingsActivityStreamsArea) {
            if (app.common.followingsActivityStreamsAreaCount === 0) {
                area.empty();
            }
            app.common.followingsActivityStreamsAreaCount++;
        }

        var html =  "<tr class='success'>" +
                        "<input type='hidden' id='actorID" + index + "' value='" + activity.actor.id + "'>" +
                        "<td>" +
                            "<div class='row'>" +
                                "<div class='col-md-1'>" +
                                    "<span class='glyphicon " + app.dictionary.objectTypes[activity.object.objectType] + "'></span>" +
                                "</div>" +
                                "<div class='col-md-3'>" +
                                    "<small><abbr class='timeago' title='" + activity.published + "'></abbr></small>" +
                                "</div>" +
                                "<div class='col-md-8'>" +
                                    "<strong>" + activity.actor.displayName + "</strong> " +
                                    app.dictionary.verbs[activity.verb] + " " +
                                    "<strong>" + activity.object.objectType + "</strong> " +
                                    "\"" + activity.object.displayName + "\"" +
                                "</div>" +
                            "</div>";

        // Building the actions
        var actions = app.dictionary.actions,
            action;
        if (!$.isEmptyObject(actions)) {
            html += "<div class='row'>" +
                    "<div class='col-md-8 col-md-offset-4'>" +
                    "<div class='pull-right'>";

            for (action in actions) {
                if (actions.hasOwnProperty(action)) {
                    html += "<button type='button' id='" + action + "ActionHandler" + index + "' class='btn btn-primary btn-xs'>" + action + "</button>&nbsp;";
                }
            }

            html += "</div></div></div>";
        }

        html += "</td></tr>";
        area.prepend(html);
        setTimeout(function() {
            $("input[id='actorID" + index + "']").parent().removeClass("success");
        }, 3000);

        // Event bindings
        $("abbr.timeago").timeago();

        if (!$.isEmptyObject(actions)) {
            for (action in actions) {
                if (actions.hasOwnProperty(action)) {
                    $("#" + action + "ActionHandler" + index).click(performAction);
                }
            }
        }
    };

    /*
     * @description Render activity streams
     * @param area jQuery DOM wrapped area to render to
     * @param data Data to render
     */
    var renderActivityStreams = function(area, data) {
        for (var i = 0, l = data.items.length; i < l; i++) {
            var item = data.items[i];
            prependActivity(area, item, i);
        }
    };

    module.activityStreams = {
        prependActivity: prependActivity,

        /*
         * @description Get and display activities
         * @param area Area to display activities in
         * @param users User IDs to display activities for
         * @param isInitial Should the area be cleared before displaying
         */
        displayActivityStreams: function(area, users, isInitial) {
            $.ajax({
                url: "/activitystreams/" + users,
                type: "GET",
                success: function(data) {
                    if (data.success) {
                        app.common.activityStreamsErrorArea.parent().addClass("hidden");
                        if (data.items.length > 0) {
                            if (isInitial) {
                                area.empty();
                            }
                            renderActivityStreams(area, data);
                        }
                    } else {
                        app.common.activityStreamsErrorArea.text(data.error).parent().removeClass("hidden");
                    }
                },
                error: function() {
                    app.common.activityStreamsErrorArea.text("Unexpected error occured.").parent().removeClass("hidden");
                }
            });
        }
    };

    return module;
})(jQuery, app || {});

var app = (function($, module) {

    /*
     * @description Common data (values, DOM objects, etc.) to work with
     */
    module.common = {
        // Logged user info
        socket: null,
        userID: null,
        userName: null,
        path: null,
        followings: [],

        // DOM areas
        myActivityStreamsArea: null,
        followingsActivityStreamsArea: null,

        // Error areas
        followingsErrorArea: null,
        actionsErrorArea: null,
        nameDialogErrorArea: null,
        activityStreamsErrorArea: null,

        // HTML Elements
        nameDialog: null,
        nameDialogLabel: null,
        objectName: null,
        objectImage: null,
        addActivityButton: null,

        // Counters
        myActivityStreamsAreaCount: 0,
        followingsActivityStreamsAreaCount: 0,

        // Constants
        emptyActivityStreamsAreaHTML: "<tr><td>Activity list is empty</td></tr>",

        // Methods
        init: function() {
            // Logged user info
            this.userID = $("#loggedUserID").val();
            this.userName = $("#loggedUserName").val();
            this.path = $("#path").val();
            var loggedUserFollowings = $("#loggedUserFollowings").val();
            if (loggedUserFollowings !== "") {
                this.followings = String(loggedUserFollowings).split(",");
            }

            // DOM areas
            this.myActivityStreamsArea = $("#myActivityStreams");
            this.followingsActivityStreamsArea = $("#friendsActivityStreams");

            // HTML elements
            this.nameDialog = $("#nameDialog");
            this.nameDialogLabel = $("#nameDialogLabel");
            this.objectName = $("#objectName");
            this.objectImage = $("#objectImage");
            this.addActivityButton = $("#addActivity");

            // Error areas
            this.nameDialogErrorArea = $("#nameDialogErrorArea");
            this.activityStreamsErrorArea = $("#activityStreamsErrorArea");
            this.followingsErrorArea = $("#followingsErrorArea");
            this.actionsErrorArea = $("#actionsErrorArea");

            this.socket = io.connect(this.path);
        }
    };

    return module;
})(jQuery, app || {});

var app = (function($, module) {

    /*
     * @description Dictionary - verbs, types, etc.
     */
    module.dictionary = {
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
        },
        actionHandlers: {
            httpActionHandler: "HttpActionHandler",
            viewActionHandler: "ViewActionHandler",
            embedActionHandler: "EmbedActionHandler",
            intentActionHandler: "IntentActionHandler"
        },
        actions: {
            see: {
                objectType: "",
                url: "/api/see",
                method: "GET"
            },
            share: {
                objectType: "",
                url: "/api/share",
                method: "GET"
            }
        },

        init: function() {
            for (var action in this.actions) {
                if (this.actions.hasOwnProperty(action)) {
                    this.actions[action].objectType = this.actionHandlers.httpActionHandler;
                    this.actions[action].url = app.common.path + this.actions[action].url;
                }
            }
        }
    };

    return module;
})(jQuery, app || {});

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
                        app.common.followingsErrorArea.parent().addClass("hidden");

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
                        app.common.followingsErrorArea.text(data.error).parent().removeClass("hidden");
                    }
                },
                error: function() {
                    app.common.followingsErrorArea.text("Unexpected error occured.").parent().removeClass("hidden");
                }
            });
        }
    };

    return module;
})(jQuery, app || {});

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
