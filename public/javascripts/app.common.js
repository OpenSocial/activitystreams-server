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
