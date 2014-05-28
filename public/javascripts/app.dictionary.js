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
        }
    };

    return module;
})(jQuery, app || {});