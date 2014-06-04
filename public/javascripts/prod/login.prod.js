(function($) {
    var user = {
        id: null,
        create: function() {
            var username = $("#username").val(),
                errorArea = $("#errorInfo"),
                usernamePattern = /^[0-9a-zA-Z_]+[0-9a-zA-Z_\s]*$/;

            if (!usernamePattern.test(username)) {
                errorArea.text("User name cannot be empty and must contain letters, digits, underscores or spaces only.").parent().removeClass("hidden");
            } else {
                $.ajax({
                    url: "/users/" + username,
                    async: false,
                    type: "POST",
                    success: function(data) {
                        if (data.success) {
                            user.id = data.userID;
                        } else {
                            errorArea.text(data.error).parent().removeClass("hidden");
                        }
                    },
                    error: function() {
                        errorArea.text("Unexpected error occured.").parent().removeClass("hidden");
                    }
                });
            }
        }
    };

    $(document).ready(function() {
        var hiddenUsers = $("#hiddenUsers"),
            showAll = $("#showAll"),
            showAllHtml = showAll.html();

        $("#play").click(function() {
            user.create();
            if (user.id) {
                window.location.replace(window.location.origin + "/activitystreams/" + user.id + "?view=true");
            }
            return false;
        });

        showAll.click(function() {
            if (hiddenUsers.hasClass("hidden")) {
                showAll.html("Hide");
            } else {
                showAll.html(showAllHtml);
            }
            hiddenUsers.toggleClass("hidden");
        });
    });
})(jQuery);
