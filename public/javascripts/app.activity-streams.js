var app = (function($, module) {

    /*
     * @description Format date to display
     * @param date Date to format
     * @return Formatted date
     */
    var formatDate = function(dateToFormat) {
        var date = new Date(Date.parse(dateToFormat)),
            day =  date.getDate() > 9 ? date.getDate() : "0" + date.getDate(),
            month =  date.getMonth() > 8 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1),
            year = date.getFullYear(),
            hours = date.getHours() > 9 ? date.getHours() : "0" + date.getHours(),
            minutes = date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes();
            return day + "." + month + "." + year + " " + hours + ":" + minutes;
    };

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

        var formattedDate = formatDate(activity.published),
            html =  "<tr class='success'><input type='hidden' id='actorID" + index + "' value='" + activity.actor.id + "'><td><div class='row'>" +
                    "<div class='col-md-1'><span class='glyphicon " + app.dictionary.objectTypes[activity.object.type] + "'></span></div>" +
                    "<div class='col-md-2'><small>" + formattedDate + "</small></div>" +
                    "<div class='col-md-9'>" +
                    "<strong>" + activity.actor.name + "</strong> " +
                    app.dictionary.verbs[activity.verb] + " " +
                    "<strong>" + activity.object.type + "</strong> " +
                    "\"" + activity.object.name + "\"" +
                    "</div>" +
                    "</div></td></tr>";
        area.prepend(html);
        setTimeout(function() {
            $("input[id='actorID" + index + "']").parent().removeClass("success");
        }, 3000);
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
                url: "/activitystreams/" + users + "?noView=true",
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