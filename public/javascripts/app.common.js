var app = (function($, module) {

    /*
     * @description Common data (values, DOM objects, etc.) to work with
     */
    module.common = {
        socket: null,
        userID: null,
        userName: null,
        path: null,
        followings: [],
        followingsErrorArea: null,
        actionsErrorArea: null,
        nameDialog: null,
        nameDialogLabel: null,
        objectName: null,
        objectImage: null,
        addActivityButton: null,
        nameDialogErrorArea: null,
        activityStreamsErrorArea: null,
        myActivityStreamsArea: null,
        myActivityStreamsAreaCount: 0,
        followingsActivityStreamsArea: null,
        followingsActivityStreamsAreaCount: 0,
        emptyActivityStreamsAreaHTML: "<tr><td>Activity list is empty</td></tr>",
        init: function() {
            this.userID = $("#loggedUserID").val();
            this.userName = $("#loggedUserName").val();
            this.path = $("#path").val();
            var loggedUserFollowings = $("#loggedUserFollowings").val();
            if (loggedUserFollowings !== "") {
                this.followings = String(loggedUserFollowings).split(",");
            }
            this.followingsErrorArea = $("#followingsErrorArea");
            this.actionsErrorArea = $("#actionsErrorArea");
            this.nameDialog = $("#nameDialog");
            this.nameDialogLabel = $("#nameDialogLabel");
            this.objectType = $("#objectType");
            this.objectName = $("#objectName");
            this.objectImage = $("#objectImage");
            this.addActivityButton = $("#addActivity");
            this.nameDialogErrorArea = $("#nameDialogErrorArea");
            this.activityStreamsErrorArea = $("#activityStreamsErrorArea");
            this.myActivityStreamsArea = $("#myActivityStreams");
            this.followingsActivityStreamsArea = $("#friendsActivityStreams");
            this.socket = io.connect(this.path);
        }
    };

    return module;
})(jQuery, app || {});
