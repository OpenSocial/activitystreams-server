var app = app || {};
app.common = (function($) {

    /*
     * @description Common data (values, DOM objects, etc.) to work with
     */
    var common = {
        userID: null,
        userName: null,
        followings: [],
        follwingsErrorArea: null,
        actionsErrorArea: null,
        nameDialog: null,
        nameDialogLabel: null,
        objectName: null,
        objectImage: null,
        addActivityButton: null,
        nameDialogErrorArea: null,
        activityStreamsErrorArea: null,
        myActivityStreamsArea: null,
        followingsActivityStreamsArea: null,
        init: function() {
            this.userID = $("#loggedUserID").val();
            this.userName = $("#loggedUserName").val();
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
        }
    };

    return common;
})(jQuery);