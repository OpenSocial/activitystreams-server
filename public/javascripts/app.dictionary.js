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
