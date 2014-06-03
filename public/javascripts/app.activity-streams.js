var app = (function($, module) {

    /*
     * @description Append one activity to the stream
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

        var html =  "<tr class='success'><input type='hidden' id='actorID" + index + "' value='" + activity.actor.id + "'><td><div class='row'>" +
                    "<div class='col-md-1'><span class='glyphicon " + app.dictionary.objectTypes[activity.object.objectType] + "'></span></div>" +
                    "<div class='col-md-2'><small><abbr class='timeago' title='" + activity.published + "'></abbr></small></div>" +
                    "<div class='col-md-9'>" +
                    "<strong>" + activity.actor.displayName + "</strong> " +
                    app.dictionary.verbs[activity.verb] + " " +
                    "<strong>" + activity.object.objectType + "</strong> " +
                    "\"" + activity.object.displayName + "\"" +
                    "</div>" +
                    "</div></td></tr>";
        area.prepend(html);
        setTimeout(function() {
            $("input[id='actorID" + index + "']").parent().removeClass("success");
        }, 3000);
        $("abbr.timeago").timeago();
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
                        if (data.items.length > 0) {
                            if (isInitial) {
                                area.empty();
                            }
                            renderActivityStreams(area, data);
                        }
                    } else {
                        app.common.activityStreamsErrorArea.text(data.error).parent().toggleClass("hidden");
                    }
                },
                error: function() {
                    app.common.activityStreamsErrorArea.text("Unexpected error occured.").parent().toggleClass("hidden");
                }
            });

        }
    };

    return module;
})(jQuery, app || {});
