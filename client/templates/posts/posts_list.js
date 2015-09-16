/*global Template, Posts*/
Template.postsList.helpers({
    posts: function () {
        return Posts.find({}, {
            sort: {
                submitted: -1
            }
        });
    }
});